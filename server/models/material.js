class Item {

    /**
     * constructs a new Material Object from the csv data
     * All not necessary properties have been commented for potential later use
     * @param {string} d - csv-row as string
     * @param {*} catId - "Material P" of the last INV-row
     * @param {*} catName - "Objektkurztext" of the last INV-row
     */
    constructor (d, catId, catName, arbMatrix, trainsPending) {
        // Keep category from last INV-row
        this.Kategorie = catName;
        this.KatID = catId;

        // relevant rows from csv
        this.Material = d["MaterialP"];
        this.Objektkurztext = d["Objektkurztext"];
        this.MengeProZug = this.convertLocaleStringToNumber(d["Menge"]);
        this.Menge = this.MengeProZug * trainsPending;
        this.ME = d["ME"];
        this.MArt = d["MArt"];
        this.Station = d["ArbPlatz"] ? this.mapMatrix(d["ArbPlatz"], arbMatrix) : "No Location";
        this.id = this.Station + this.Material;

        // this.SchGut = ((d) => {
        //     return (d["SchGut"] === "X") ? true : false;
        // });
        // this.Stf = d["Stf"];
        // this.Pos = d["Pos."];
        // this.Werk = d["Werk"];
        // this.ZTP = d["ZTP"];
        // this.Horiz = d["Horiz"];
        // this.DMk = d["DMk"];
        // this.BeschArt = d["BeschArt"];
    }

    mapMatrix(station, arbMatrix) {
        if (!station) return "No Location";
        if (!arbMatrix) return station;

        const map = arbMatrix.find((map) => map.ArbPlatz === station) ? arbMatrix.find((map) => map.ArbPlatz === station).Area : '!' + station;

        if (map === "Not Valid" || map === "(Leer)") return "No Location";
        return map;
    }

    convertLocaleStringToNumber (x) {
        return parseFloat(x.trim().replace('.', '').replace(',', '.'));
    }
}

module.exports = { Item };
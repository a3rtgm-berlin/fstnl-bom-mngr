module.exports = class Part {
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
        this['Part'] = d["MaterialP"]; // Part#
        this['Description'] = d["Objektkurztext"]; // Description
        this['Quantity Per Train'] = this.convertLocaleStringToNumber(d["Menge"]); // Quantity Per Train
        this['Quantity Total'] = this['Quantity Per Train'] * trainsPending; // Total Quantity
        this['Unit'] = d["ME"]; // Unit
        this['ArbPlatz'] = d["ArbPlatz"];
        this['Location'] = d["ArbPlatz"] ? this.mapMatrix(d["ArbPlatz"], arbMatrix) : "No Location"; // Location
        this['Location Index'] = this['Location'] + this['Part']; // Location Index
        // this.Material = d["MaterialP"]; // Part#
        // this.Objektkurztext = d["Objektkurztext"]; // Description
        // this.MengeProZug = this.convertLocaleStringToNumber(d["Menge"]); // Quantity Per Train
        // this.Menge = this.MengeProZug * trainsPending; // Total Quantity
        // this.ME = d["ME"]; // Unit
        // this.MArt = d["MArt"];
        // this.ArbPlatz = d["ArbPlatz"];
        // this.Station = d["ArbPlatz"] ? this.mapMatrix(d["ArbPlatz"], arbMatrix) : "No Location"; // Location
        // this.id = this.Station + this.Material; // Location Index
    }

    mapMatrix(arbPlatz, arbMatrix) {
        if (!arbPlatz) return "No Location";
        if (!arbMatrix) return arbPlatz;

        const map = arbMatrix.find((map) => map.ArbPlatz === arbPlatz) ? arbMatrix.find((map) => map.ArbPlatz === arbPlatz).Location : '!' + arbPlatz;

        if (map === "Not Valid" || map === "(Leer)") return "No Location";
        return map;
    }

    convertLocaleStringToNumber (x) {
        return parseFloat(x.trim().replace('.', '').replace(',', '.'));
    }
}
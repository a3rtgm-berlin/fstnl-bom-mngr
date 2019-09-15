class Item {

    /**
     * constructs a new Material Object from the csv data
     * All not necessary properties have been commented for potential later use
     * @param {string} d - csv-row as string
     * @param {*} catId - "Material P" of the last INV-row
     * @param {*} catName - "Objektkurztext" of the last INV-row
     */

    constructor (d, catId, catName) {
        // Keep category from last INV-row
        this.Kategorie = catName;
        this.KatID = catId;

        // relevant rows from csv
        this.Material = d["Material P"];
        this.Objektkurztext = d["Objektkurztext"];
        this.Menge = parseInt(d["   Menge"]);
        this.ME = d["ME"];
        this.MArt = d["MArt"];
        this.Station = d["ArbPlatz"];


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
}

module.exports = { Item };
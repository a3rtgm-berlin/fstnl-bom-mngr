module.exports = class MovingFile {
    constructor(boms) {
        this.quantity = 'Quantity Total';
        this.comparators = [
            'Location',
            'Part',
        ];

        const sortedLists = boms.sort((a, b) => {
            var dateA = a.date.split('.');
            var dateB = b.date.split('.');
            var diff = new Date(dateA[2], dateA[1] - 1, dateA[0]) - new Date(dateB[2], dateB[1] - 1, dateB[0]);
            return diff !== 0 ? diff : a.uploadDate - b.uploadDate;
        });
        
        this.lastBom = {
            id: sortedLists[0].id,
            json: JSON.parse(JSON.stringify(sortedLists[0].json))
            // json: this.concatModulesAtLocation(sortedLists[0].json)
        };
        this.currentBom = {
            id: sortedLists[1].id,
            json: JSON.parse(JSON.stringify(sortedLists[1].json))
            // json: this.concatModulesAtLocation(sortedLists[1].json)
        };

        this.setMeta();
    }

    concatModulesAtLocation(bom) {
        return bom.map(item => {
            bom.forEach((compItem, i) => {
                if (!item.delete) {
                    if (item.Location === compItem.Location && item.Part === compItem.Part) {
                        item[this.quantity] += compItem[this.quantity];
                        compItem.delete = true;
                    }
                }
            });

            return item;
        }).filter(item => !item.delete);
    }

    compareLists() {
        const $added = new Set();
        const $removed = new Set();
        const movingMeta = {
            added: 0,
            removed: 0,
            modified: 0,
            remain: 0,
            moved: 0,
            obsolete: 0,
        };

        this.currentBom.json.forEach((currentItem) => {
            let $ancestors = this.lastBom.json;

            this.comparators.some((prop, i) => {
                $ancestors = $ancestors.filter((oldItem) => {
                    return oldItem[prop] === currentItem[prop];
                });

                if ($ancestors.length > 0) {
                    if (i >= this.comparators.length - 1) {
                        const diff = currentItem[this.quantity] - $ancestors[0][this.quantity];

                        currentItem.Change = diff;

                        if (diff !== 0) {
                            movingMeta.modified += 1;
                            currentItem.Status = 'modified';
                        }
                        else {
                            movingMeta.remain += 1;
                            currentItem.Status = 'remain';
                        }
                    }
                    return false;
                } else {
                    $added.add(currentItem);
                    return true;
                }
            });
        });

        this.lastBom.json.forEach((oldItem) => {
            const $successors = this.currentBom.json.filter((currentItem) => {
                let remains = true;

                this.comparators.some((prop) => {
                    if (currentItem[prop] !== oldItem[prop]) {
                        remains = false;
                        return true;
                    }
                });

                return remains;
            });

            if ($successors.length === 0) {
                $removed.add(oldItem);
            } else {
                oldItem.Change = $successors[0][this.quantity] - oldItem[this.quantity];
            }
        });

        $added.forEach((e, currentItem, s) => {
            const $ancestor = Array.from($removed).find(oldItem => oldItem.Part === currentItem.Part);

            if ($ancestor) {
                $added.delete(currentItem);
                $removed.delete($ancestor);

                $ancestor.Status = "movedTo";
                $ancestor.Moved = currentItem.Location;
                this.currentBom.json.push($ancestor);

                currentItem.Status = "movedFrom";
                currentItem.Moved = $ancestor.Location;

                movingMeta.Moved += 1;
            } else {
                currentItem.Status = 'added';
                movingMeta.added += 1;
            }
        });

        $removed.forEach((e, oldItem, s) => {
            oldItem.Status = "removed";
            movingMeta.removed += 1;
            this.currentBom.json.push(oldItem);
        });

        this.currentBom.json.forEach(item => {
            if (item.Status === "removed") {
                if (!this.currentBom.json.find(currentItem => 
                    currentItem.Part === item.Part && 
                    currentItem.Location !== item.Location && 
                    currentItem.Status !== "removed")) {
                        item.Status = "obsolete";
                        movingMeta.removed -= 1;
                        movingMeta.obsolete += 1;
                    }
            }
        });

        return movingMeta;
    }

    setMeta() {
        this.meta = {};
        this.meta.current = this.currentBom.id;
        this.meta.last = this.lastBom.id;
        this.meta.changes = this.compareLists();
    }
};

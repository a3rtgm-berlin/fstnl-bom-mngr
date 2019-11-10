const Config = require('./config');

module.exports = class Comparison {
    constructor(lists) {
        this.client = 'BOM';
        this.comparators = Config[this.client].comparators;
        this.quantitySelector = Config[this.client].quantity;

        const sortedLists = lists.sort((a, b) => {
            return Date.parse(a.id) - Date.parse(b.id);
        });
        
        this.lastList = {
            id: sortedLists[0].id,
            json: this.concatModulesAtStation(sortedLists[0].json)
        };
        this.currentList = {
            id: sortedLists[1].id,
            json: this.concatModulesAtStation(sortedLists[1].json)
        };

        this.setMeta();
    }

    concatModulesAtStation(list) {
        return list.map(item => {
            list.forEach((compItem, i) => {
                if (!item.delete) {
                    if (item.Station === compItem.Station && item.Material === compItem.Material && item.KatID !== compItem.KatID) {
                        item[this.quantitySelector] += compItem[this.quantitySelector];
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
        const comparedList = {
            added: 0,
            removed: 0,
            modified: 0,
            remain: 0,
            moved: 0,
            obsolete: 0,
        };

        this.currentList.json.forEach((currentItem) => {
            let $ancestors = this.lastList.json;

            this.comparators.some((prop, i) => {
                $ancestors = $ancestors.filter((oldItem) => {
                    return oldItem[prop] === currentItem[prop];
                });

                if ($ancestors.length > 0) {
                    if (i >= this.comparators.length - 1) {
                        const diff = currentItem[this.quantitySelector] - $ancestors[0][this.quantitySelector];

                        currentItem.change = diff;

                        if (diff !== 0) {
                            comparedList.modified += 1;
                            currentItem.status = 'modified';
                        }
                        else {
                            comparedList.remain += 1;
                            currentItem.status = 'remain';
                        }
                    }
                } else {
                    $added.add(currentItem);
                    return true;
                }
            });
        });

        this.lastList.json.forEach((oldItem) => {
            const $successors = this.currentList.json.filter((currentItem) => {
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
                oldItem.status = $successors[0][this.quantitySelector] - oldItem[this.quantitySelector];
            }
        });

        $added.forEach((e, currentItem, s) => {
            const $ancestor = Array.from($removed).find(oldItem => oldItem.Material === currentItem.Material);

            if ($ancestor) {
                $added.delete(currentItem);
                $removed.delete($ancestor);

                $ancestor.status = "movedTo";
                $ancestor.moved = currentItem.Station;
                this.currentList.json.push($ancestor);

                currentItem.status = "movedFrom";
                currentItem.moved = $ancestor.Station;

                comparedList.moved += 1;
            } else {
                currentItem.status = 'added';
                comparedList.added += 1;
            }
        });

        $removed.forEach((e, oldItem, s) => {
            oldItem.status = "removed";
            comparedList.removed += 1;
            this.currentList.json.push(oldItem);
        });

        this.currentList.json.forEach(item => {
            if (item.status === "removed") {
                if (!this.currentList.json.find(currentItem => 
                    currentItem.Material === item.Material && 
                    currentItem.Station !== item.Station && 
                    currentItem.status !== "removed")) {
                        item.status = "obsolete";
                        comparedList.removed -= 1;
                        comparedList.obsolete += 1;
                    }
            }
        });

        return comparedList;
    }

    setMeta() {
        this.meta = {};
        this.meta.current = this.currentList.id;
        this.meta.last = this.lastList.id;
        this.meta.changes = this.compareLists();
    }
};

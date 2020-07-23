export interface MetaData {
    project: string;
    current: string;
    last: string;
    changes: Changes;
}

interface Changes {
    added: number;
    modified: number;
    remain: number;
    removed: number;
    moved: number;
}

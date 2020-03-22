declare interface MasterBom {
    id: string;
    projects: string[];
    json: object;
    movingFile: object;
    date: string;
    uploadDate: Date;
}

declare interface Bom {
    id: string;
    name: string;
    json: object;
    csv: string;
    date: string;
    uploadDate: Date;
    projects: any;
}

declare interface MetaData {
    project: string;
    current: string;
    last: string;
    changes: Changes;
}

declare interface Changes {
    added: number;
    modified: number;
    remain: number;
    removed: number;
    moved: number;
}

declare interface Project {
    name: string;
    tag: string;
    state: string;
    description: string;
    trainsCount: number;
    deadline: Date;
    boms: string[];
    multiBom: number;
    active: boolean;
    isArchived: boolean;
    createdBy: string;
    created: Date;
}

declare interface User {
    mail: string;
    username: string;
    password: string;
    role: string;
}   

export interface Project {
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

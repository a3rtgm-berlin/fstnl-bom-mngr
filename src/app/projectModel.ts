import { MaterialList } from './materialListModel';

export interface Project {
    name: string;
    tag: string;
    state: string;
    description: string;
    trainsCount: number;
    deadline: Date;
    bomLists: string[];
    multiBom: number;
    active: boolean;
    isArchived: boolean;
    createdBy: String;
    created: Date;
};
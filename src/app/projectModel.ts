import { MaterialList } from './materialListModel';

export interface Project {
    name: string;
    tag: string;
    description: string;
    trainsCount: number;
    deadline: Date;
    bomLists: string[];
    multiBom: boolean;
    active: boolean
};
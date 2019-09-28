import { MaterialList } from './materialListModel';

export interface Project {
    name: string;
    description: string;
    trainsCount: number;
    deadline: Date;
    bomLists: Set<String>;
};
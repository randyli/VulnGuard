import { Project } from "../types";

export interface GitBranch {
  name: string;
  lastCommit: string;
  author: string;
  date: string;
  isDefault?: boolean;
}

export const MOCK_BRANCHES: GitBranch[] = [
    { name: 'main', lastCommit: 'a1b2c3d', author: 'DevSecOps Admin', date: '2 hours ago', isDefault: true },
    { name: 'develop', lastCommit: 'e5f6g7h', author: 'Jane Doe', date: '5 hours ago' },
    { name: 'feat/user-auth', lastCommit: 'i8j9k0l', author: 'John Smith', date: '1 day ago' },
];

export const gitClone = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(true), 3000); // Simulate network delay
    });
};

export const createBranch = async (projectId: string, branchName: string): Promise<GitBranch> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: branchName,
                lastCommit: 'a1b2c3d', // Branches off main
                author: 'DevSecOps Admin',
                date: 'Just now'
            });
        }, 1500);
    });
};

export const getBranches = async (projectId: string): Promise<GitBranch[]> => {
     return new Promise((resolve) => {
        setTimeout(() => resolve(MOCK_BRANCHES), 500);
    });
}
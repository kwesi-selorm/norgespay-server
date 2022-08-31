export type DBSalary = {
    jobTitle: string;
    company: string;
    city: string;
    salary: number;
    previousSalaries: number[];
    sector: string;
    experience: number;
};

export type NewSalary = Omit<DBSalary, "previousSalaries">;

export type NewUser = {
    email: string;
    username: string;
    password: string;
};

export type AddedSalary = {
    city: string;
    company: string;
    experience: number;
    jobTitle: string;
    salary: number;
    sector: string;
    userId: string;
};

//REQUESTS
export type UpdateSalaryRequest = {
    params: { id: unknown };
    body: { updatedSalary: unknown };
};

export type AddSalaryRequest = {
    body: {
        jobTitle: unknown;
        company: unknown;
        salary: unknown;
        city: unknown;
        sector: unknown;
        experience: unknown;
    };
};

export interface LoginRequest {
    body: { username: unknown; password: unknown };
}

export interface SignUpRequest {
    body: {
        email: unknown;
        username: unknown;
        password: unknown;
        confirmPassword: unknown;
    };
}

export interface SessionUser {
    username: string;
    id: string;
    contributed: boolean;
}

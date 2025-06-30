export interface Book {
    id: string;
    title: string;
    author: string;
    publishedYear: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateBookRequest {
    title: string;
    author: string;
    publishedYear: number;
}

export interface UpdateBookRequest {
    title?: string;
    author?: string;
    publishedYear?: number;
}

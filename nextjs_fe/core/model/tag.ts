export interface Tags {
    id: number;
    name: string;
    tag_category_id: number;
    created_at: Date;
    updated_at: Date;
}

export interface TagCategories {
    id: number;
    title: string;
    tags: Tags[];
    created_at: Date;
    updated_at: Date;
}
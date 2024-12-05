export interface Review {
    _id?: string,
    owner: string; // User ID of the review owner
    rating: number; // Rating from 0 to 5 in steps of 0.5
    comment: string; // Text of the review
}
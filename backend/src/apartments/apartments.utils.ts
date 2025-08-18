export const apartmentMessages = {
    SUCCESS: {
        CREATED: 'Apartment added successfully!',
        UPDATED: 'Apartment updated successfully!',
        DELETED: 'Apartment deleted successfully!',
        FETCHED: 'Apartments fetched successfully!',
    },
    ERROR: {
        NOT_FOUND: 'Apartment not found',
        UPDATE_FAILED: 'Failed to update apartment',
        DELETE_FAILED: 'Failed to delete apartment',
        MISSING_FILTER: 'Please provide at least one filter',
    },
};

export function resolveOwnerId(headers: Record<string, any>): number {
    const hdr = headers['x-user-id'] ?? headers['X-User-Id'];
    const parsed = Number(hdr);
    return Number.isFinite(parsed) && parsed > 0 ? parsed: 1 
}

export function makePagingResult<T>(
    items: T[],
    total: number,
    page: number,
    limit: number
) {
    return {
        items,
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
    };
}

export function buildImageUrl(filename?: string): string | null {
    if (!filename) return null;
    return `${process.env.APP_URL || 'http://localhost:3000'}/uploads/apartment/${filename}`;
}
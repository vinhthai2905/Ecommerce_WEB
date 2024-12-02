// slug
export const slug = (value: string) => {
    return (
        value
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '') +
        '-' +
        Math.random().toString(36).substr(2, 9)
    );
};
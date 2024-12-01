interface WindowOptions {
    url?: string;
    title?: string;
    width: number;
    height: number;
    left?: number;
    top?: number;
    [key: string]: any;
}

export function openWindow(
    url: string | WindowOptions,
    title: string,
    options: WindowOptions = {
        width: 600,
        height: 720,
    }
): Window | null {
    if (typeof url === 'object') {
        options = url;
        url = '';
    }

    options = {
        url: url as string,
        title,
        ...options,
    };

    const dualScreenLeft = window.screenLeft;
    const dualScreenTop = window.screenTop;
    const width =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        window.screen.width;
    const height =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        window.screen.height;

    options.left = width / 2 - options.width / 2 + dualScreenLeft;
    options.top = height / 2 - options.height / 2 + dualScreenTop;

    const optionsStr = Object.keys(options)
        .reduce((acc, key) => {
            acc.push(`${key}=${options[key]}`);
            return acc;
        }, [] as string[])
        .join(',');

    const newWindow = window.open(options.url || '', options.title, optionsStr);

    if (newWindow) {
        newWindow.focus();
    }

    return newWindow;
}
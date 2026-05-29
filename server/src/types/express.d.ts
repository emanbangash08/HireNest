// Override Express 5's ParamsDictionary to keep params typed as string (not string | string[]).
// Route params are always strings at runtime — Express parses them that way.
// export {} makes this a module file so declare module becomes an augmentation, not a replacement.
export {};

declare module 'express-serve-static-core' {
    interface ParamsDictionary {
        [key: string]: string;
    }
}

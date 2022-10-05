import {Dispatch, useState} from 'react';

export default function useLocalStorage<T>(
    key: string,
    initialValue: T,
): [T, Dispatch<T>] {
    const [value, setValue] = useState<T>(
        () => {
            const val = window.localStorage.getItem(key);
            return (val && JSON.parse(val)) || initialValue
        }
    );

    const setItem = (newValue: T) => {
        setValue(newValue);
        window.localStorage.setItem(key, JSON.stringify(newValue));
    };

    return [value, setItem];
}

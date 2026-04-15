import { useCallback, useEffect, useState } from "react";
import { localStorageService } from "@/lib/local-storage";

type Serializer<T> = (value: T) => string;
type Deserializer<T> = (value: string) => T;

interface UseLocalStorageOptions<T> {
    serializer?: Serializer<T>;
    deserializer?: Deserializer<T>;
}

export function useLocalStorage<T>(
    key: string,
    initialValue: T,
    options: UseLocalStorageOptions<T> = {},
) {
    const { serializer = JSON.stringify, deserializer = JSON.parse } = options;

    const readValue = useCallback((): T => {
        const raw = localStorageService.getItem(key);
        if (raw == null) return initialValue;
        try {
            return deserializer(raw);
        } catch {
            return initialValue;
        }
    }, [key, deserializer, initialValue]);

    const [value, setValue] = useState<T>(readValue);

    useEffect(() => {
        setValue(readValue());
    }, [key]);

    const setStoredValue = useCallback(
        (val: T) => {
            setValue(val);
            localStorageService.setItem(key, serializer(val));
        },
        [key, serializer],
    );

    const remove = useCallback(() => {
        setValue(initialValue);
        localStorageService.removeItem(key);
    }, [key, initialValue]);

    return { value, setValue: setStoredValue, remove };
}

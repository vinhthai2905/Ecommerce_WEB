'use client';
import SearchOptions from '@/app/(client)/search/SeachOptions';
import useDebounce from '@/core/hooks/debounce';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

export default function SearchMobile() {
    const [textSearch, setTextSearch] = useState('Search');
    const [isFocus, setIsFocus] = useState(false);
    const [isSearch, setIsSearch] = useState(false);

    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const searchOptionsRef = useRef<HTMLDivElement>(null);

    const { replace } = useRouter();

    const handleFocus = () => {
        if (search !== '') {
            setIsSearch(true);
        }
        setIsFocus(true);
        setTextSearch('Search jobs or ask questions...');
    };

    useEffect(() => {
        const handleBlur = (event: MouseEvent) => {
            if (
                searchOptionsRef.current &&
                !searchOptionsRef.current.contains(event.target as Node)
            ) {
                setIsFocus(false);
                if (search === '') {
                    setTextSearch('Search');
                }
                setIsSearch(false);
            }
        };
        window.addEventListener('click', handleBlur);
        return () => {
            window.removeEventListener('click', handleBlur);
        };
    }, [searchOptionsRef]);

    useEffect(() => {
        if (search === '') {
            setIsSearch(false);
        } else if (debouncedSearch) {
            setIsSearch(true);
        }
    }, [debouncedSearch]);

    return (
        <div className='w-relative w-full lg:w-[35rem]' ref={searchOptionsRef}>
            <div
                className={cn(
                    'relative flex h-12 cursor-text items-center overflow-hidden bg-[#f5f8fc] px-4 dark:bg-[#1c1f26]',
                    (isFocus || isSearch) && 'border dark:border-[#383d48]',
                    isSearch ? 'rounded-t-[16px]' : 'rounded-[12px]'
                )}
            >
                <svg
                    width='1em'
                    height='1em'
                    viewBox='0 0 24 24'
                    xmlns='http://www.w3.org/2000/svg'
                    className='text-text-tertiary pointer-events-none mr-3 h-8 w-8 dark:fill-white'
                >
                    <path
                        d='M10 3.347c1.138 0 2.213.266 3.163.739-.255.462-.74.764-1.283.787l-.87.036A5.636 5.636 0 0010 4.818c-3.038 0-5.5 2.415-5.5 5.394 0 2.906 2.344 5.276 5.279 5.39l.221.004.221-.004c2.935-.114 5.279-2.484 5.279-5.39l-.003-.13.082-.215c.2-.524.676-.893 1.234-.967l.058-.005a6.771 6.771 0 01-.803 4.742 2.849 2.849 0 012.076.657l.157.143 1.872 1.836a2.731 2.731 0 010 3.916 2.864 2.864 0 01-3.852.13l-.14-.13-1.872-1.836a2.732 2.732 0 01-.818-2.19 7.062 7.062 0 01-3.491.914c-3.866 0-7-3.073-7-6.865 0-3.791 3.134-6.865 7-6.865zm5.37 12.13a1.28 1.28 0 00-.097 1.73l.096.106 1.872 1.836c.241.236.552.362.868.378h.135l.135-.013c.269-.04.527-.162.733-.365a1.28 1.28 0 00.097-1.73l-.097-.106-1.871-1.835a1.342 1.342 0 00-1.872 0zm.05-12.056l.044 1.013a2.493 2.493 0 001.648 2.225l.97.355c.457.167.35.83-.138.85l-1.033.044a2.592 2.592 0 00-.304.03l-.05.01c-.08.014-.159.032-.236.054l-.147.046-.18.07-.168.08-.113.063-.141.09-.164.121-.032.026c-.323.27-.579.62-.734 1.026l-.361.95a.43.43 0 01-.373.285h-.078l-.077-.012a.429.429 0 01-.34-.407l-.044-1.014a2.493 2.493 0 00-1.648-2.224l-.97-.355c-.457-.167-.35-.83.138-.85l1.034-.044c.3-.013.588-.077.855-.185l.109-.048c.175-.08.34-.178.49-.294l.148-.122.12-.114.136-.152.045-.056.078-.104.055-.082-.03.046a2.47 2.47 0 00.262-.505l.362-.95c.17-.45.846-.345.867.134z'
                        fill='currentcolor'
                        fillRule='evenodd'
                    ></path>
                </svg>
                <input
                    placeholder={textSearch}
                    onFocus={handleFocus}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            if (e.key === 'Enter') {
                                replace(`search?q=${search}`);
                            }
                        }
                    }}
                    type='text'
                    className='w-full bg-[#f5f8fc] outline-none dark:bg-[#1c1f26] '
                />
            </div>
            {isSearch && <SearchOptions textSearch={search} />}
        </div>
    );
}
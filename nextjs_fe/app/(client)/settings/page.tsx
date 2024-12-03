'use client';
import { AuthContext } from '@/components/Providers/AuthProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useDebounce from '@/core/hooks/debounce';
import { TagCategories, Tags } from '@/core/model/tag';
import api from '@/lib/api';
import { cn } from '@/lib/utils';
import { ChevronRight, Loader2, Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

export default function Settings() {
    const searchParams = useSearchParams();
    const { replace } = useRouter();

    const [tagCategories, setTagCategories] = React.useState<TagCategories[]>(
        []
    );
    const [tagSearch, setTagSearch] = React.useState<Tags[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userTags, setUserTags] = useState<number[]>([]);
    const [openTagCategory, setOpenTagCategory] = useState<number[]>([]);
    const [search, setSearch] = useState('');

    const zUser = useContext(AuthContext).zUser;
    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
        if (zUser) {
            setUserTags(zUser.user_tags);
        }
    }, [zUser]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const res = await api.getFromServerAxios({
                    endpoint: '/tag-categories',
                });

                if (res.status === 200) {
                    setTagCategories(res.data.data);
                }
            } catch (error) {}
            setIsLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (search === '') {
            replace('/settings');
        } else if (debouncedSearch) {
            replace(`/settings?search=${search}`);
        }
    }, [debouncedSearch]);

    useEffect(() => {
        if (search === '') {
            setTagSearch([]);
            return;
        }

        // search tags in tagCategories
        if (searchParams.has('search') || search !== '') {
            setTagSearch([]);

            tagCategories.forEach((tagCategory) => {
                tagCategory.tags.forEach((tag) => {
                    // tag name to lowercase
                    if (tag.name.toLowerCase().includes(search.toLowerCase())) {
                        setTagSearch((prev) => [...prev, tag]);
                    }
                });
            });
        }
    }, [searchParams]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        replace(`/settings?search=${search}`);
    };

    const handleOpenTagCategory = (id: number) => {
        if (openTagCategory.includes(id)) {
            setOpenTagCategory(openTagCategory.filter((_id) => _id !== id));
        } else {
            setOpenTagCategory([...openTagCategory, id]);
        }
    };

    const updateTags = async (id: number) => {
        try {
            // load user from local storage
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const res = await api.putToServerAxios({
                endpoint: `user-tags/${id}`,
                data: {},
            });
            if (res.status === 201) {
                setUserTags([...userTags, id]);
                user.user_tags = [...userTags, id];
            } else {
                setUserTags(userTags.filter((tag) => tag !== id));
                user.user_tags = userTags.filter((tag) => tag !== id);
            }
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {}
    };

    const followAllTags = async (id: number) => {
        try {
            // load user from local storage
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const res = await api.postToServerAxios({
                endpoint: `user-tags/all/${id}`,
                data: {},
            });

            if (res.status === 201) {
                // get all id tags in tagCategory
                const _tags = tagCategories
                    .find((tagCategory) => tagCategory.id === id)
                    ?.tags.map((tag) => tag.id)
                    .filter((tag) => !userTags.includes(tag));
                if (!_tags) {
                    return;
                }

                setUserTags([...userTags, ..._tags]);
                user.user_tags = [...userTags, ..._tags];
                localStorage.setItem('user', JSON.stringify(user));
            }
        } catch (error) {}
    };

    const unfollowAllTags = async (id: number) => {
        try {
            // load user from local storage
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            const res = await api.deleteToServerAxios({
                endpoint: `user-tags/all/${id}`,
            });

            if (res.status === 200) {
                // get all id tags in tagCategory
                const _tags = tagCategories
                    .find((tagCategory) => tagCategory.id === id)
                    ?.tags.map((tag) => tag.id)
                    .filter((tag) => userTags.includes(tag));
                if (!_tags) {
                    return;
                }

                setUserTags(userTags.filter((tag) => !_tags.includes(tag)));
                user.user_tags = userTags.filter((tag) => !_tags.includes(tag));
                localStorage.setItem('user', JSON.stringify(user));
            }
        } catch (error) {}
    };

    return (
        <div className='flex h-full flex-col items-center justify-center'>
            <div className='h-full w-full lg:w-1/2'>
                <div className='flex items-center justify-between py-6 text-lg font-bold'>
                    <span className='text-xl'>
                        Settings for your feed <span role='img'>🚀</span>
                    </span>
                </div>
                <div className='text-sm text-gray-400'>
                    Follow the tags you are interested in to get the best
                </div>
                <form onSubmit={handleSearch}>
                    <Input
                        placeholder='Search for tags'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
                <div className='py-4'>
                    {isLoading ? (
                        <div className='flex items-center justify-center'>
                            <Loader2 className='h-10 w-10 animate-spin items-center' />
                        </div>
                    ) : (
                        <>
                            {tagSearch.length === 0 ? (
                                <div className='flex h-full w-full flex-col gap-4'>
                                    {tagCategories.map((tagCategory) => (
                                        <>
                                            <div
                                                key={tagCategory.id}
                                                className={cn(
                                                    'flex w-full items-center justify-start rounded-lg bg-[#ced2da] p-4 dark:bg-[#333842]',
                                                    // id tags in tagCategory has exist in user_tags border left purple
                                                    userTags.some((userTag) =>
                                                        tagCategory.tags.some(
                                                            (tag) =>
                                                                tag.id ===
                                                                userTag
                                                        )
                                                    ) &&
                                                    'border-l-4 border-purple-500'
                                                )}
                                            >
                                                <button
                                                    className='flex w-full items-center justify-start rounded-lg bg-[#ced2da] p-4 dark:bg-[#333842]'
                                                    onClick={() => {
                                                        handleOpenTagCategory(
                                                            tagCategory.id
                                                        );
                                                    }}
                                                >
                                                    {openTagCategory.includes(
                                                        tagCategory.id
                                                    ) ? (
                                                        <ChevronRight
                                                            size={24}
                                                            className='rotate-90 transform'
                                                        />
                                                    ) : (
                                                        <ChevronRight
                                                            size={24}
                                                        />
                                                    )}
                                                    <span className='pl-4 text-black dark:text-white'>
                                                        {tagCategory.title}
                                                    </span>
                                                    <div className='flex-1 '></div>
                                                </button>

                                                <div className='justify-end'>
                                                    <Button
                                                        onClick={() => {
                                                            tagCategory.tags.every(
                                                                (tag) =>
                                                                    userTags.includes(
                                                                        tag.id
                                                                    )
                                                            )
                                                                ? unfollowAllTags(
                                                                    tagCategory.id
                                                                )
                                                                : followAllTags(
                                                                    tagCategory.id
                                                                );
                                                        }}
                                                    >
                                                        {
                                                            // check if all tags in tagCategory has exist in user_tags
                                                            tagCategory.tags.every(
                                                                (tag) =>
                                                                    userTags.includes(
                                                                        tag.id
                                                                    )
                                                            )
                                                                ? `Unfollow (${tagCategory.tags.length}) tags`
                                                                : 'Follow all'
                                                        }
                                                    </Button>
                                                </div>
                                            </div>

                                            {openTagCategory.includes(
                                                tagCategory.id
                                            ) && (
                                                <div className='flex w-full flex-wrap gap-4'>
                                                    {tagCategory.tags.map(
                                                        (tag) => (
                                                            <button
                                                                key={tag.id}
                                                                onClick={() =>
                                                                    updateTags(
                                                                        tag.id
                                                                    )
                                                                }
                                                            >
                                                                <Badge
                                                                    key={tag.id}
                                                                    className={cn(
                                                                        'px-4',
                                                                        userTags.includes(
                                                                            tag.id
                                                                        ) &&
                                                                        'bg-purple-500'
                                                                    )}
                                                                >
                                                                    <span className='pr-4'>
                                                                        #{' '}
                                                                        {
                                                                            tag.name
                                                                        }
                                                                    </span>
                                                                    <Plus
                                                                        size={
                                                                            12
                                                                        }
                                                                    />
                                                                </Badge>
                                                            </button>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    {tagSearch.map((tag) => (
                                        <button
                                            key={tag.id}
                                            onClick={() => updateTags(tag.id)}
                                        >
                                            <Badge
                                                key={tag.id}
                                                className={cn(
                                                    'px-4',
                                                    userTags.includes(tag.id) &&
                                                    'bg-purple-500'
                                                )}
                                            >
                                                <span className='pr-4'>
                                                    # {tag.name}
                                                </span>
                                                <Plus size={12} />
                                            </Badge>
                                        </button>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
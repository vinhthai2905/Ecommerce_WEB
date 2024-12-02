'use client';

import * as React from 'react';
import { X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Command as CommandPrimitive } from 'cmdk';
import { Tags } from '@/core/model/tag';
import { UseFormSetValue, UseFormTrigger } from 'react-hook-form';

type Props = {
    data: Tags[];
    defaultTags: Tags[];
    setValue: UseFormSetValue<any>;
    trigger: UseFormTrigger<any>;
};

export function FancyMultiSelect({
                                     data,
                                     defaultTags,
                                     setValue,
                                     trigger,
                                 }: Props) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [selected, setSelected] = React.useState<Tags[]>(defaultTags);
    const [inputValue, setInputValue] = React.useState('');

    React.useEffect(() => {
        if (defaultTags.length > 0) {
            setSelected(defaultTags);
        }
    }, [defaultTags]);

    const handleUnselect = React.useCallback((framework: Tags) => {
        setSelected((prev) => prev.filter((s) => s.id !== framework.id));

        console.log('unselect', framework);
        setValue('tags', [
            ...selected.filter((s) => s.id !== framework.id).map((s) => s.id),
        ]);
        trigger('tags');
    }, []);

    const handleKeyDown = React.useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            const input = inputRef.current;
            if (input) {
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    if (input.value === '') {
                        setSelected((prev) => {
                            const newSelected = [...prev];
                            newSelected.pop();
                            return newSelected;
                        });
                    }
                }
                // This is not a default behaviour of the <input /> field
                if (e.key === 'Escape') {
                    input.blur();
                }
            }
        },
        []
    );

    const selectables = data.filter(
        (framework) => !selected.includes(framework)
    );

    return (
        <Command
            onKeyDown={handleKeyDown}
            className='overflow-visible bg-transparent'
        >
            <div className='group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
                <div className='flex flex-wrap gap-1'>
                    {selected.map((framework) => {
                        return (
                            <Badge key={framework.id} variant='secondary'>
                                {framework.name}
                                <button
                                    className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleUnselect(framework);
                                        }
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onClick={() => handleUnselect(framework)}
                                >
                                    <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                                </button>
                            </Badge>
                        );
                    })}
                    {/* Avoid having the "Search" Icon */}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder='Select frameworks...'
                        className='ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
                    />
                </div>
            </div>
            <div className='relative mt-2'>
                <CommandList>
                    {open && selectables.length > 0 ? (
                        <div className='absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in'>
                            <CommandGroup className='h-full overflow-auto'>
                                {selectables.map((framework) => {
                                    return (
                                        <CommandItem
                                            key={framework.id}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onSelect={(value) => {
                                                setInputValue('');
                                                setSelected((prev) => [
                                                    ...prev,
                                                    framework,
                                                ]);
                                                setValue('tags', [
                                                    ...selected.map(
                                                        (s) => s.id
                                                    ),
                                                    framework.id,
                                                ]);

                                                trigger('tags');
                                            }}
                                            className={'cursor-pointer'}
                                        >
                                            {framework.name}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </div>
                    ) : null}
                </CommandList>
            </div>
        </Command>
    );
}
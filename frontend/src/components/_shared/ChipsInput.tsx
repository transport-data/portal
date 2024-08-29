"use client";

import { Command as CommandPrimitive, useCommandState } from "cmdk";
import { X } from "lucide-react";
import * as React from "react";
import { forwardRef, useEffect } from "react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Badge } from "@components/ui/badge";

export interface Option {
  value: string;
  label: string;
  disable?: boolean;
  /** fixed option that can't be removed. */
  fixed?: boolean;
  /** Group the options by providing key. */
  [key: string]: string | boolean | undefined;
}
interface GroupOption {
  [key: string]: Option[];
}

interface MultipleSelectorProps {
  value?: Option[];
  defaultOptions?: Option[];
  validationOptions?: {
    validateData: (value: string) => boolean;
    errorMessage: string;
  };
  removeSuggestions?: boolean;
  /** manually controlled options */
  options?: Option[];
  placeholder?: string;
  /** Loading component. */
  loadingIndicator?: React.ReactNode;
  /** Empty component. */
  emptyIndicator?: React.ReactNode;
  /** Debounce time for async search. Only work with `onSearch`. */
  delay?: number;
  /**
   * Only work with `onSearch` prop. Trigger search when `onFocus`.
   * For example, when user click on the input, it will trigger the search to get initial options.
   **/
  triggerSearchOnFocus?: boolean;
  /** async search */
  onSearch?: (value: string) => Promise<Option[]>;
  /**
   * sync search. This search will not showing loadingIndicator.
   * The rest props are the same as async search.
   * i.e.: creatable, groupBy, delay.
   **/
  onSearchSync?: (value: string) => Option[];
  onChange?: (options: Option[]) => void;
  /** Limit the maximum number of selected options. */
  maxSelected?: number;
  /** When the number of selected options exceeds the limit, the onMaxSelected will be called. */
  onMaxSelected?: (maxLimit: number) => void;
  /** Hide the placeholder when there are options selected. */
  hidePlaceholderWhenSelected?: boolean;
  disabled?: boolean;
  /** Group the options base on provided key. */
  groupBy?: string;
  className?: string;
  badgeClassName?: string;
  /**
   * First item selected is a default behavior by cmdk. That is why the default is true.
   * This is a workaround solution by add a dummy item.
   *
   * @reference: https://github.com/pacocoursey/cmdk/issues/171
   */
  selectFirstItem?: boolean;
  /** Allow user to create option when there is no option matched. */
  creatable?: boolean;
  /** Props of `Command` */
  commandProps?: React.ComponentPropsWithoutRef<typeof Command>;
  /** Props of `CommandInput` */
  inputProps?: Omit<
    React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>,
    "value" | "placeholder" | "disabled"
  >;
  /** hide the clear all button. */
  hideClearAllButton?: boolean;
}

export interface MultipleSelectorRef {
  selectedValue: Option[];
  input: HTMLInputElement;
}

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function transToGroupOption(options: Option[], groupBy?: string) {
  if (options.length === 0) {
    return {};
  }
  if (!groupBy) {
    return {
      "": options,
    };
  }

  const groupOption: GroupOption = {};
  options.forEach((option) => {
    const key = (option[groupBy] as string) || "";
    if (!groupOption[key]) {
      groupOption[key] = [];
    }
    groupOption[key]!.push(option);
  });
  return groupOption;
}

function removePickedOption(groupOption: GroupOption, picked: Option[]) {
  const cloneOption = JSON.parse(JSON.stringify(groupOption)) as GroupOption;

  for (const [key, value] of Object.entries(cloneOption)) {
    cloneOption[key] = value.filter(
      (val) => !picked.find((p) => p.value === val.value)
    );
  }
  return cloneOption;
}

function isOptionsExist(groupOption: GroupOption, targetOption: Option[]) {
  for (const [, value] of Object.entries(groupOption)) {
    if (
      value.some((option) => targetOption.find((p) => p.value === option.value))
    ) {
      return true;
    }
  }
  return false;
}

/**
 * The `CommandEmpty` of shadcn/ui will cause the cmdk empty not rendering correctly.
 * So we create one and copy the `Empty` implementation from `cmdk`.
 *
 * @reference: https://github.com/hsuanyi-chou/shadcn-ui-expansions/issues/34#issuecomment-1949561607
 **/
const CommandEmpty = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof CommandPrimitive.Empty>
>(({ className, ...props }, forwardedRef) => {
  const render = useCommandState((state) => state.filtered.count === 0);

  if (!render) return null;

  return (
    <div
      ref={forwardedRef}
      className={cn("py-6 text-center text-sm", className)}
      cmdk-empty=""
      role="presentation"
      {...props}
    />
  );
});

CommandEmpty.displayName = "CommandEmpty";

const MultipleSelector = React.forwardRef<
  MultipleSelectorRef,
  MultipleSelectorProps
>(
  (
    {
      value,
      onChange,
      placeholder,
      defaultOptions: arrayDefaultOptions = [],
      options: arrayOptions,
      delay,
      onSearch,
      onSearchSync,
      loadingIndicator,
      emptyIndicator,
      maxSelected = Number.MAX_SAFE_INTEGER,
      onMaxSelected,
      hidePlaceholderWhenSelected,
      disabled,
      groupBy,
      className,
      badgeClassName,
      selectFirstItem = true,
      creatable = false,
      triggerSearchOnFocus = false,
      commandProps,
      inputProps,
      validationOptions,
      removeSuggestions = false,
      hideClearAllButton = false,
    }: MultipleSelectorProps,
    ref: React.Ref<MultipleSelectorRef>
  ) => {
    const { errorMessage, validateData } = validationOptions || {};
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    const [onScrollbar, setOnScrollbar] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null); // Added this

    const [selected, setSelected] = React.useState<Option[]>(value || []);
    const [options, setOptions] = React.useState<GroupOption>(
      transToGroupOption(arrayDefaultOptions, groupBy)
    );
    const [inputValue, setInputValue] = React.useState("");
    const debouncedSearchTerm = useDebounce(inputValue, delay || 500);

    React.useImperativeHandle(
      ref,
      () => ({
        selectedValue: [...selected],
        input: inputRef.current as HTMLInputElement,
        focus: () => inputRef.current?.focus(),
      }),
      [selected]
    );

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleUnselect = React.useCallback(
      (option: Option) => {
        const newOptions = selected.filter((s) => s.value !== option.value);
        setSelected(newOptions);
        onChange?.(newOptions);
      },
      [onChange, selected]
    );

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
          if (e.key === "Delete" || e.key === "Backspace") {
            if (input.value === "" && selected.length > 0) {
              const lastSelectOption = selected[selected.length - 1];
              // If last item is fixed, we should not remove it.
              if (!lastSelectOption?.fixed) {
                handleUnselect(selected[selected.length - 1]!);
              }
            }
          }
          // This is not a default behavior of the <input /> field
          if (e.key === "Escape") {
            input.blur();
          }
        }
      },
      [handleUnselect, selected]
    );

    useEffect(() => {
      if (open) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchend", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("touchend", handleClickOutside);
      };
    }, [open]);

    useEffect(() => {
      if (value) {
        setSelected(value);
      }
    }, [value]);

    useEffect(() => {
      /** If `onSearch` is provided, do not trigger options updated. */
      if (!arrayOptions || onSearch) {
        return;
      }
      const newOption = transToGroupOption(arrayOptions || [], groupBy);
      if (JSON.stringify(newOption) !== JSON.stringify(options)) {
        setOptions(newOption);
      }
    }, [arrayDefaultOptions, arrayOptions, groupBy, onSearch, options]);

    useEffect(() => {
      /** sync search */

      const doSearchSync = () => {
        const res = onSearchSync?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
      };

      const exec = async () => {
        if (!onSearchSync || !open) return;

        if (triggerSearchOnFocus) {
          doSearchSync();
        }

        if (debouncedSearchTerm) {
          doSearchSync();
        }
      };

      void exec();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

    useEffect(() => {
      /** async search */

      const doSearch = async () => {
        setIsLoading(true);
        const res = await onSearch?.(debouncedSearchTerm);
        setOptions(transToGroupOption(res || [], groupBy));
        setIsLoading(false);
      };

      const exec = async () => {
        if (!onSearch || !open) return;

        if (triggerSearchOnFocus) {
          await doSearch();
        }

        if (debouncedSearchTerm) {
          await doSearch();
        }
      };

      void exec();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearchTerm, groupBy, open, triggerSearchOnFocus]);

    const CreatableItem = () => {
      if (!creatable) return undefined;
      if (
        isOptionsExist(options, [{ value: inputValue, label: inputValue }]) ||
        selected.find((s) => s.value === inputValue)
      ) {
        return undefined;
      }

      const Item = (
        <CommandItem
          value={inputValue}
          className="cursor-pointer"
          onMouseDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onSelect={(value: string) => {
            if (selected.length >= maxSelected) {
              onMaxSelected?.(selected.length);
              return;
            }
            setInputValue("");
            const newOptions = [...selected, { value, label: value }];
            setSelected(newOptions);
            onChange?.(newOptions);
          }}
        >
          {`Create "${inputValue}"`}
        </CommandItem>
      );

      // For normal creatable
      if (!onSearch && inputValue.length > 0) {
        return Item;
      }

      // For async search creatable. avoid showing creatable item before loading at first.
      if (onSearch && debouncedSearchTerm.length > 0 && !isLoading) {
        return Item;
      }

      return undefined;
    };

    const EmptyItem = React.useCallback(() => {
      if (!emptyIndicator) return undefined;

      // For async search that showing emptyIndicator
      if (onSearch && !creatable && Object.keys(options).length === 0) {
        return (
          <CommandItem value="-" disabled>
            {emptyIndicator}
          </CommandItem>
        );
      }

      return <CommandEmpty>{emptyIndicator}</CommandEmpty>;
    }, [creatable, emptyIndicator, onSearch, options]);

    const selectables = React.useMemo<GroupOption>(
      () => removePickedOption(options, selected),
      [options, selected]
    );

    /** Avoid Creatable Selector freezing or lagging when paste a long string. */
    const commandFilter = React.useCallback(() => {
      if (commandProps?.filter) {
        return commandProps.filter;
      }

      if (creatable) {
        return (value: string, search: string) => {
          return value.toLowerCase().includes(search.toLowerCase()) ? 1 : -1;
        };
      }
      // Using default filter in `cmdk`. We don't have to provide it.
      return undefined;
    }, [creatable, commandProps?.filter]);

    return (
      <div>
        <div className="mb-2">
          <Command
            ref={dropdownRef}
            {...commandProps}
            onKeyDown={(e) => {
              commandProps?.onKeyDown?.(e);
              handleKeyDown(e);
            }}
            className={cn(
              "h-auto overflow-visible bg-transparent",
              commandProps?.className
            )}
            shouldFilter={
              commandProps?.shouldFilter !== undefined
                ? commandProps.shouldFilter
                : !onSearch
            } // When onSearch is provided, we don't want to filter the options. You can still override it.
            filter={commandFilter()}
          >
            <div
              className={cn(
                "min-h-10 rounded-md border border-[#D1D5DB] text-sm focus-within:border-[#111928]",
                {
                  "py-2": selected.length !== 0,
                  "cursor-text": !disabled && selected.length !== 0,
                },
                className
              )}
              onClick={() => {
                if (disabled) return;
                inputRef.current?.focus();
              }}
            >
              <div className="relative flex flex-wrap gap-1">
                {selected.map((option) => {
                  return (
                    <Badge
                      key={option.value}
                      className={cn(
                        "data-[disabled]:bg-muted-foreground data-[disabled]:text-muted data-[disabled]:hover:bg-muted-foreground",
                        "data-[fixed]:bg-muted-foreground data-[fixed]:text-muted data-[fixed]:hover:bg-muted-foreground",
                        badgeClassName
                      )}
                      data-fixed={option.fixed}
                      data-disabled={disabled || undefined}
                    >
                      {option.label}
                      <button
                        className={cn(
                          "ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2",
                          (disabled || option.fixed) && "hidden"
                        )}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUnselect(option);
                          }
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={() => handleUnselect(option)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="10"
                          height="10"
                          viewBox="0 0 10 10"
                          fill="none"
                        >
                          <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M1.00524 1.00521C1.13651 0.873976 1.31453 0.800255 1.50014 0.800255C1.68576 0.800255 1.86377 0.873976 1.99504 1.00521L5.00014 4.01031L8.00524 1.00521C8.06982 0.938349 8.14706 0.885021 8.23246 0.848335C8.31786 0.811648 8.40972 0.792338 8.50266 0.79153C8.59561 0.790723 8.68778 0.808434 8.77381 0.84363C8.85984 0.878827 8.93799 0.930804 9.00372 0.996529C9.06944 1.06225 9.12142 1.14041 9.15662 1.22644C9.19181 1.31247 9.20953 1.40464 9.20872 1.49759C9.20791 1.59053 9.1886 1.68239 9.15191 1.76779C9.11523 1.85319 9.0619 1.93043 8.99504 1.99501L5.98994 5.00011L8.99504 8.00521C9.12255 8.13723 9.19311 8.31405 9.19151 8.49759C9.18992 8.68112 9.1163 8.85669 8.98652 8.98648C8.85673 9.11626 8.68116 9.18988 8.49762 9.19148C8.31409 9.19307 8.13727 9.12252 8.00524 8.99501L5.00014 5.98991L1.99504 8.99501C1.86302 9.12252 1.6862 9.19307 1.50266 9.19148C1.31912 9.18988 1.14356 9.11626 1.01377 8.98648C0.883985 8.85669 0.810366 8.68112 0.808771 8.49759C0.807177 8.31405 0.877733 8.13723 1.00524 8.00521L4.01034 5.00011L1.00524 1.99501C0.874014 1.86374 0.800293 1.68572 0.800293 1.50011C0.800293 1.31449 0.874014 1.13648 1.00524 1.00521Z"
                            fill="#006064"
                          />
                        </svg>
                      </button>
                    </Badge>
                  );
                })}
                {/* Avoid having the "Search" Icon */}
                <CommandPrimitive.Input
                  {...inputProps}
                  ref={inputRef}
                  value={inputValue}
                  disabled={disabled}
                  onValueChange={(value) => {
                    if (validateData) setShowErrorMessage(validateData(value));
                    setInputValue(value);
                    inputProps?.onValueChange?.(value);
                  }}
                  onBlur={(event) => {
                    if (!onScrollbar) {
                      setOpen(false);
                    }
                    inputProps?.onBlur?.(event);
                  }}
                  onFocus={(event) => {
                    setOpen(true);
                    triggerSearchOnFocus && onSearch?.(debouncedSearchTerm);
                    inputProps?.onFocus?.(event);
                  }}
                  placeholder={
                    hidePlaceholderWhenSelected && selected.length !== 0
                      ? ""
                      : placeholder
                  }
                  style={{}}
                  className={cn(
                    "remove-input-ring flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
                    {
                      "w-full": hidePlaceholderWhenSelected,
                      "py-2": selected.length === 0,
                      "ml-1": selected.length !== 0,
                    },
                    inputProps?.className
                  )}
                />
                <button
                  type="button"
                  onClick={() => {
                    setSelected(selected.filter((s) => s.fixed));
                    onChange?.(selected.filter((s) => s.fixed));
                  }}
                  className={cn(
                    "absolute right-0 h-6 w-6 p-0",
                    (hideClearAllButton ||
                      disabled ||
                      selected.length < 1 ||
                      selected.filter((s) => s.fixed).length ===
                        selected.length) &&
                      "hidden"
                  )}
                >
                  <X />
                </button>
              </div>
            </div>

            <div className={"relative " + (removeSuggestions ? "hidden" : "")}>
              {open && (
                <CommandList
                  className="absolute top-1 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in"
                  onMouseLeave={() => {
                    setOnScrollbar(false);
                  }}
                  onMouseEnter={() => {
                    setOnScrollbar(true);
                  }}
                  onMouseUp={() => {
                    inputRef.current?.focus();
                  }}
                >
                  {isLoading ? (
                    <>{loadingIndicator}</>
                  ) : (
                    <>
                      {EmptyItem()}
                      {CreatableItem()}
                      {!selectFirstItem && (
                        <CommandItem value="-" className="hidden" />
                      )}
                      {Object.entries(selectables).map(([key, dropdowns]) => (
                        <CommandGroup
                          key={key}
                          heading={key}
                          className="h-full overflow-auto"
                        >
                          <>
                            {dropdowns.map((option) => {
                              return (
                                <CommandItem
                                  key={option.value}
                                  value={option.value}
                                  disabled={option.disable}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onSelect={() => {
                                    if (selected.length >= maxSelected) {
                                      onMaxSelected?.(selected.length);
                                      return;
                                    }
                                    setInputValue("");
                                    const newOptions = [...selected, option];
                                    setSelected(newOptions);
                                    onChange?.(newOptions);
                                  }}
                                  className={cn(
                                    "cursor-pointer",
                                    option.disable &&
                                      "cursor-default text-muted-foreground"
                                  )}
                                >
                                  {option.label}
                                </CommandItem>
                              );
                            })}
                          </>
                        </CommandGroup>
                      ))}
                    </>
                  )}
                </CommandList>
              )}
            </div>
          </Command>
        </div>

        {showErrorMessage && (
          <span className="text-red-500">{errorMessage}</span>
        )}
      </div>
    );
  }
);

MultipleSelector.displayName = "MultipleSelector";
export default MultipleSelector;

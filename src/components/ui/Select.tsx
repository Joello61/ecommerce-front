/* eslint-disable jsx-a11y/role-supports-aria-props */
import { forwardRef, useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// Types pour les options du select
export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

// Props de base pour le select
interface BaseSelectProps {
  id?: string
  name?: string
  label?: string
  helperText?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
  searchable?: boolean
  clearable?: boolean
  loading?: boolean
  emptyMessage?: string
  maxHeight?: string
  options: SelectOption[]
  onSearch?: (query: string) => void
}

// Props pour select simple
interface SingleSelectProps extends BaseSelectProps {
  multiple?: false
  value?: string | number
  onChange?: (value: string | number) => void
}

// Props pour select multiple
interface MultipleSelectProps extends BaseSelectProps {
  multiple: true
  value?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
}

// Union des types
type ExtendedSelectProps = SingleSelectProps | MultipleSelectProps

const Select = forwardRef<HTMLButtonElement, ExtendedSelectProps>(
  ({
    value,
    onChange,
    options = [],
    placeholder = 'Sélectionner...',
    error,
    disabled = false,
    required = false,
    multiple = false,
    className,
    id,
    name,
    label,
    helperText,
    searchable = false,
    clearable = false,
    loading = false,
    emptyMessage = 'Aucune option disponible',
    maxHeight = '200px',
    onSearch,
    ...props
  }, ref) => {
    
    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    
    const containerRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)
    const optionsRef = useRef<HTMLDivElement>(null)
    
    const selectId = id || name

    // Filtrer les options selon la recherche
    const filteredOptions = searchable && searchQuery
      ? options.filter(option => 
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options

    // Fermer le dropdown en cliquant à l'extérieur
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false)
          setSearchQuery('')
          setHighlightedIndex(-1)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Focus sur l'input de recherche quand le dropdown s'ouvre
    useEffect(() => {
      if (isOpen && searchable && searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }, [isOpen, searchable])

    // Navigation au clavier
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return

        switch (event.key) {
          case 'ArrowDown':
            event.preventDefault()
            setHighlightedIndex(prev => 
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            )
            break
          case 'ArrowUp':
            event.preventDefault()
            setHighlightedIndex(prev => 
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            )
            break
          case 'Enter':
            event.preventDefault()
            if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
              handleOptionSelect(filteredOptions[highlightedIndex])
            }
            break
          case 'Escape':
            setIsOpen(false)
            setSearchQuery('')
            setHighlightedIndex(-1)
            break
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, highlightedIndex, filteredOptions])

    // Obtenir les valeurs sélectionnées
    const getSelectedOptions = () => {
      if (!value) return []
      
      const values = Array.isArray(value) ? value : [value]
      return options.filter(option => values.includes(option.value))
    }

    const selectedOptions = getSelectedOptions()

    // Gérer la sélection d'une option - VERSION CORRIGÉE
    const handleOptionSelect = (option: SelectOption) => {
      if (option.disabled) return

      if (multiple) {
        // Cast vers MultipleSelectProps pour accéder aux types corrects
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const multipleProps = props as Omit<MultipleSelectProps, keyof BaseSelectProps>
        const currentValues = Array.isArray(value) ? value : []
        const newValues = currentValues.includes(option.value)
          ? currentValues.filter(v => v !== option.value)
          : [...currentValues, option.value]
        
        // onChange est maintenant typé correctement pour multiple
        if (onChange) {
          (onChange as (value: (string | number)[]) => void)(newValues)
        }
      } else {
        // Cast vers SingleSelectProps pour accéder aux types corrects
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const singleProps = props as Omit<SingleSelectProps, keyof BaseSelectProps>
        
        // onChange est maintenant typé correctement pour single
        if (onChange) {
          (onChange as (value: string | number) => void)(option.value)
        }
        setIsOpen(false)
        setSearchQuery('')
      }
      
      setHighlightedIndex(-1)
    }

    // Supprimer une option sélectionnée (mode multiple) - VERSION CORRIGÉE
    const handleRemoveOption = (optionValue: string | number, event: React.MouseEvent) => {
      event.stopPropagation()
      
      if (multiple && Array.isArray(value) && onChange) {
        const newValues = value.filter(v => v !== optionValue)
        ;(onChange as (value: (string | number)[]) => void)(newValues)
      }
    }

    // Vider la sélection - VERSION CORRIGÉE
    const handleClear = (event: React.MouseEvent) => {
      event.stopPropagation()
      
      if (onChange) {
        if (multiple) {
          ;(onChange as (value: (string | number)[]) => void)([])
        } else {
          ;(onChange as (value: string | number) => void)('')
        }
      }
    }

    // Gérer la recherche
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value
      setSearchQuery(query)
      setHighlightedIndex(-1)
      
      if (onSearch) {
        onSearch(query)
      }
    }

    // Obtenir le texte d'affichage
    const getDisplayText = () => {
      if (selectedOptions.length === 0) {
        return placeholder
      }
      
      if (multiple) {
        return `${selectedOptions.length} sélectionné(s)`
      }
      
      return selectedOptions[0]?.label || placeholder
    }

    const selectClassName = cn(
      'flex h-12 w-full items-center justify-between rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-400 dark:focus:ring-blue-400',
      error && 'border-red-500 focus:ring-red-500 dark:border-red-400 dark:focus:ring-red-400',
      isOpen && 'ring-2 ring-blue-500 border-transparent dark:ring-blue-400',
      className
    )

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label 
            htmlFor={selectId} 
            className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Select Container */}
        <div ref={containerRef} className="relative">
          <button
            ref={ref}
            type="button"
            id={selectId}
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={selectClassName}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-invalid={error ? 'true' : 'false'}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(props as any)}
          >
            {/* Selected Values Display */}
            <div className="flex-1 flex flex-wrap gap-1 items-center">
              {multiple && selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-md dark:bg-blue-900 dark:text-blue-200"
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveOption(option.value, e)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
                      aria-label={`Supprimer ${option.label}`}
                    >
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))
              ) : (
                <span className={cn(
                  'truncate',
                  selectedOptions.length === 0 && 'text-slate-500 dark:text-slate-400'
                )}>
                  {getDisplayText()}
                </span>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-1">
              {/* Loading Spinner */}
              {loading && (
                <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}

              {/* Clear Button */}
              {clearable && selectedOptions.length > 0 && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Vider la sélection"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}

              {/* Dropdown Arrow */}
              <svg
                className={cn(
                  'h-4 w-4 text-slate-400 transition-transform',
                  isOpen && 'transform rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg">
              {/* Search Input */}
              {searchable && (
                <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Rechercher..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* Options List */}
              <div 
                ref={optionsRef}
                className="py-1 overflow-auto"
                style={{ maxHeight }}
                role="listbox"
              >
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400 text-center">
                    {emptyMessage}
                  </div>
                ) : (
                  filteredOptions.map((option, index) => {
                    const isSelected = multiple 
                      ? Array.isArray(value) && value.includes(option.value)
                      : value === option.value
                    const isHighlighted = index === highlightedIndex

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleOptionSelect(option)}
                        disabled={option.disabled}
                        className={cn(
                          'w-full px-3 py-2 text-left text-sm transition-colors flex items-center justify-between',
                          isHighlighted && 'bg-blue-50 dark:bg-blue-900/20',
                          isSelected && 'bg-blue-100 text-blue-900 dark:bg-blue-900/40 dark:text-blue-100',
                          option.disabled 
                            ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                            : 'text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-700'
                        )}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span className="truncate">{option.label}</span>
                        
                        {isSelected && (
                          <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    )
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p id={`${selectId}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p id={`${selectId}-helper`} className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
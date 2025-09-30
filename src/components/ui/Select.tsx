import { forwardRef, useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface BaseSelectProps {
  label?: string
  helperText?: string
  error?: string
  placeholder?: string
  options: SelectOption[]
  searchable?: boolean
  clearable?: boolean
  loading?: boolean
  emptyMessage?: string
  disabled?: boolean
  required?: boolean
  className?: string
  id?: string
  name?: string
}

interface SingleSelectProps extends BaseSelectProps {
  multiple?: false
  value?: string | number
  onChange?: (value: string | number) => void
}

interface MultipleSelectProps extends BaseSelectProps {
  multiple: true
  value?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
}

type SelectProps = SingleSelectProps | MultipleSelectProps

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      placeholder = 'Sélectionner...',
      options = [],
      value,
      onChange,
      multiple = false,
      searchable = false,
      clearable = false,
      loading = false,
      emptyMessage = 'Aucune option',
      disabled = false,
      required = false,
      className,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const [highlighted, setHighlighted] = useState(-1)

    const containerRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    const selectId = id || name

    // Filtrage des options
    const filtered = searchable && search
      ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()))
      : options

    // Options sélectionnées
    const selected = options.filter((opt) =>
      Array.isArray(value) ? value.includes(opt.value) : value === opt.value
    )

    // Fermeture au clic extérieur
    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false)
          setSearch('')
          setHighlighted(-1)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Focus sur recherche
    useEffect(() => {
      if (isOpen && searchable && searchRef.current) {
        searchRef.current.focus()
      }
    }, [isOpen, searchable])

    // Navigation clavier
    useEffect(() => {
      if (!isOpen) return

      const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            setHighlighted((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
            break
          case 'ArrowUp':
            e.preventDefault()
            setHighlighted((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
            break
          case 'Enter':
            e.preventDefault()
            if (highlighted >= 0 && highlighted < filtered.length) {
              handleSelect(filtered[highlighted])
            }
            break
          case 'Escape':
            setIsOpen(false)
            setSearch('')
            setHighlighted(-1)
            break
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, highlighted, filtered])

    const handleSelect = (option: SelectOption) => {
      if (option.disabled || !onChange) return

      if (multiple) {
        const values = Array.isArray(value) ? value : []
        const newValues = values.includes(option.value)
          ? values.filter((v) => v !== option.value)
          : [...values, option.value]
        ;(onChange as (v: (string | number)[]) => void)(newValues)
      } else {
        ;(onChange as (v: string | number) => void)(option.value)
        setIsOpen(false)
        setSearch('')
      }
      setHighlighted(-1)
    }

    const handleRemove = (optionValue: string | number, e: React.MouseEvent) => {
      e.stopPropagation()
      if (multiple && Array.isArray(value) && onChange) {
        ;(onChange as (v: (string | number)[]) => void)(value.filter((v) => v !== optionValue))
      }
    }

    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      if (onChange) {
        if (multiple) {
          ;(onChange as (v: (string | number)[]) => void)([])
        } else {
          ;(onChange as (v: string | number) => void)('')
        }
      }
    }

    const displayText = selected.length === 0
      ? placeholder
      : multiple
        ? `${selected.length} sélectionné(s)`
        : selected[0]?.label || placeholder

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <span className="text-danger ml-1">*</span>}
          </label>
        )}

        <div ref={containerRef} className="relative">
          <button
            ref={ref}
            type="button"
            id={selectId}
            disabled={disabled}
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'input flex items-center justify-between w-full',
              error && 'border-danger',
              isOpen && 'ring-2 ring-primary border-primary',
              className
            )}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            {...props}
          >
            <div className="flex-1 flex flex-wrap gap-1 items-center min-h-[1.5rem]">
              {multiple && selected.length > 0 ? (
                selected.map((opt) => (
                  <span key={opt.value} className="badge bg-primary/10 text-primary inline-flex items-center gap-1">
                    {opt.label}
                    <button
                      type="button"
                      onClick={(e) => handleRemove(opt.value, e)}
                      className="hover:bg-primary/20 rounded-full"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))
              ) : (
                <span className={cn('truncate', selected.length === 0 && 'text-gray-500')}>{displayText}</span>
              )}
            </div>

            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              {loading && (
                <svg className="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {clearable && selected.length > 0 && !disabled && (
                <button type="button" onClick={handleClear} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
              <svg className={cn('w-4 h-4 text-gray-400 transition-transform', isOpen && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {isOpen && (
            <div className="absolute z-50 w-full mt-1 card shadow-lg max-h-60 overflow-auto">
              {searchable && (
                <div className="p-2 border-b border-gray-200">
                  <input
                    ref={searchRef}
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Rechercher..."
                    className="input w-full"
                  />
                </div>
              )}

              <div className="py-1">
                {filtered.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500 text-center">{emptyMessage}</div>
                ) : (
                  filtered.map((opt, idx) => {
                    const isSelected = Array.isArray(value) ? value.includes(opt.value) : value === opt.value
                    const isHighlighted = idx === highlighted

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleSelect(opt)}
                        disabled={opt.disabled}
                        className={cn(
                          'w-full px-3 py-2 text-left text-sm flex items-center justify-between transition-colors',
                          isHighlighted && 'bg-gray-50',
                          isSelected && 'bg-primary/10 text-primary',
                          opt.disabled ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'
                        )}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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

        {error && (
          <p className="mt-1.5 text-sm text-danger">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-600">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
'use client';

import ReactSelect from "react-select";

interface SelectProps {
  label: string;
  value?: Record<string, any>[];
  onChange: (value: Record<string, any>[]) => void;
  options?: Record<string, any>[];
  disabled?: boolean;
}

function Select({ label, value, onChange, options, disabled }: SelectProps) {
  return (
    <div className="z-[100]">
      <label className="block text-sm font-medium leading-6 text-neutral-300">
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          classNames={{
            control: () => 'text-sm !bg-[#303030] !border-neutral-700 !text-white !shadow-none',
            menu: () => '!bg-[#303030] !border-neutral-700 !shadow-lg !rounded-lg',
            option: (state) => {
              const { isFocused, isSelected } = state;
              return `!text-white ${isSelected ? '!bg-cyan-600' : isFocused ? '!bg-neutral-700' : '!bg-[#303030]'}`;
            },
            multiValue: () => '!bg-neutral-700 !text-white !rounded-md',
            multiValueLabel: () => '!text-white',
            multiValueRemove: () => '!text-neutral-400 hover:!bg-neutral-600 hover:!text-white',
            placeholder: () => '!text-neutral-400',
            singleValue: () => '!text-white',
            input: () => '!text-white',
            dropdownIndicator: () => '!text-neutral-400',
            clearIndicator: () => '!text-neutral-400',
            indicatorSeparator: () => '!hidden',
          }}
          isDisabled={disabled}
          value={value}
          onChange={(newValue) => onChange(newValue as Record<string, any>[])}
          isMulti
          options={options}
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            control: (base, state) => ({
              ...base,
              backgroundColor: '#303030',
              borderColor: state.isFocused ? '#06b6d4' : '#404040',
              '&:hover': { borderColor: state.isFocused ? '#06b6d4' : '#525252' },
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isSelected ? '#06b6d4' : state.isFocused ? '#404040' : '#303030',
              color: '#fff',
              '&:active': { backgroundColor: '#06b6d4' },
            }),
            menu: (base) => ({
              ...base,
              backgroundColor: '#303030',
              border: '1px solid #404040',
              boxShadow: '0 4px 6px rgba(0,0,0,0.25)',
            }),
          }}
        />
      </div>
    </div>
  );
}

export default Select;
# CCMS Parts Management Documentation

## Component Hierarchy

```
PartsTab/
├── ActionButtons/
│   ├── Add from NAGS
│   ├── Add Custom Part
│   ├── Add Labor
│   ├── Add Deductible Buyback
│   └── Add Rebate
├── PartEntryForm (Dynamic)/
│   ├── NAGS Form
│   ├── Custom Part Form
│   ├── Labor Form
│   ├── Deductible Form
│   └── Rebate Form
├── PartsTable/
│   ├── Part Number
│   ├── Description
│   ├── List Price
│   ├── Shop Price
│   └── Carrier Price
├── FinancialSummary/
│   ├── Subtotal
│   ├── Tax
│   └── Total
└── ShopInvoice/
    ├── Basic Info
    │   ├── Number
    │   ├── Date
    │   └── Shop Amount
    ├── Financial Details
    │   ├── Pre Tax Amount
    │   ├── Shop Admin Fee (% and $)
    │   ├── Shop Admin Fee Tax
    │   ├── Deductible
    │   ├── Total
    │   ├── Shop Amount
    │   └── Variance
    └── Upload Section
```

## Component Functions

### 1. PartsTab

**Purpose**: Main container for parts management functionality  
**Location**: `src/components/claims/tabs/parts/PartsTab.tsx`  
**Functions**:

- Manages active form state
- Coordinates communication between components
- Handles layout and component organization

### 2. Action Buttons

**Purpose**: Trigger different part entry forms  
**Location**: Within PartsTab  
**States**:

- NAGS (default active)
- Custom Part
- Labor
- Deductible Buyback
- Rebate

### 3. PartEntryForm

**Purpose**: Dynamic form for entering different types of parts/items  
**Location**: `src/components/claims/tabs/parts/PartEntryForm.tsx`  
**Props**:

- formType: "nags" | "custom" | "labor" | "deductible" | "rebate"
- onClose: () => void
- onSubmit: (data: any) => void

### 4. PartsTable

**Purpose**: Display and manage added parts  
**Location**: `src/components/claims/tabs/parts/PartsTable.tsx`  
**Features**:

- Display parts in tabular format
- Sort functionality (planned)
- Edit/Delete parts (planned)

### 5. FinancialSummary

**Purpose**: Show financial calculations  
**Location**: `src/components/claims/tabs/parts/FinancialSummary.tsx`  
**Calculations**:

- Subtotal of all parts
- Tax calculations
- Total amount

### 6. ShopInvoice

**Purpose**: Manage shop invoice details and uploads  
**Location**: `src/components/claims/tabs/parts/ShopInvoice.tsx`  
**Features**:

- Invoice information entry
- Financial calculations
- Document upload capability
- Variance calculation

## State Management

Currently using local React state with useState  
Future considerations:

- Implement Redux/Context for global state
- Add form validation
- Implement calculation logic

## Planned Features

1. Form validation
2. Part search functionality
3. Tax calculation automation
4. Document preview
5. Part price history
6. Audit trail

## File Structure

```
src/
└── components/
    └── claims/
        ├── modals/
        │   └── UploadModal.tsx
        └── tabs/
            └── parts/
                ├── PartsTab.tsx
                ├── PartEntryForm.tsx
                ├── PartsTable.tsx
                ├── FinancialSummary.tsx
                ├── ShopInvoice.tsx
                └── ShopInvoiceUpload.tsx
```

## Development Guidelines

1. Use TypeScript for type safety
2. Follow Tailwind CSS conventions
3. Implement responsive design
4. Add proper error handling
5. Include loading states
6. Add proper accessibility attributes

## Getting Started

1. Install dependencies:

```bash
npm install
npm install -D @tailwindcss/forms
```

2. Configure Tailwind:

```js
// tailwind.config.js
module.exports = {
  plugins: [require("@tailwindcss/forms")],
};
```

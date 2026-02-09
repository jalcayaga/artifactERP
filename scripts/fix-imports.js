#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Services and hooks that should come from @artifact/core/client
const CLIENT_EXPORTS = [
    'useAuth', 'useCompany', 'useTheme', 'useSupabaseAuth',
    'AuthProvider', 'CompanyProvider', 'ThemeProvider', 'SupabaseAuthProvider',
    'CompanyService', 'ProductService', 'InvoiceService', 'PurchaseService',
    'SaleService', 'SupplierService', 'ContactPersonService', 'UploadService',
    'PaymentService', 'QuoteService', 'OrderService', 'DashboardService',
    'UserService', 'PurchaseOrderService', 'ApiService', 'AuthService',
    'fetchWithAuth', 'supabase'
];

// Everything else (types, utils, constants) comes from @artifact/core
const CORE_EXPORTS = [
    'Company', 'Product', 'User', 'Invoice', 'Purchase', 'Sale', 'Order',
    'ContactPerson', 'Lot', 'Quote', 'Payment', 'OrderItem', 'PurchaseItem',
    'CreateCompanyDto', 'UpdateCompanyDto', 'CompanyFilterOptions',
    'CreateProductDto', 'UpdateProductDto', 'ProductFilterOptions',
    'UserRole', 'AuthenticatedUser', 'CreateUserDto',
    'DashboardStats', 'PaginatedResponse',
    'formatCurrencyChilean', 'formatDate', 'formatRut', 'api',
    'API_BASE_URL', 'TENANT_ID_HEADER'
];

function fixImportsInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');

    // Find all imports from @artifact/core/client
    const importRegex = /import\s+{([^}]+)}\s+from\s+['"]@artifact\/core\/client['"]/g;

    let newContent = content;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
        const fullImport = match[0];
        const imports = match[1].split(',').map(i => i.trim());

        const coreImports = [];
        const clientImports = [];

        imports.forEach(imp => {
            const cleanImp = imp.trim();
            if (CLIENT_EXPORTS.includes(cleanImp)) {
                clientImports.push(cleanImp);
            } else {
                coreImports.push(cleanImp);
            }
        });

        let replacement = '';
        if (coreImports.length > 0) {
            replacement += `import { ${coreImports.join(', ')} } from '@artifact/core';\n`;
        }
        if (clientImports.length > 0) {
            replacement += `import { ${clientImports.join(', ')} } from '@artifact/core/client';`;
        }

        newContent = newContent.replace(fullImport, replacement.trim());
    }

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`✅ Fixed: ${filePath}`);
        return true;
    }

    return false;
}

function processDirectory(dir) {
    const files = execSync(`find ${dir} -type f \\( -name "*.tsx" -o -name "*.ts" \\)`, { encoding: 'utf8' })
        .split('\n')
        .filter(Boolean);

    let fixedCount = 0;
    files.forEach(file => {
        if (fixImportsInFile(file)) {
            fixedCount++;
        }
    });

    console.log(`\n📊 Fixed ${fixedCount} files`);
}

// Process admin app
processDirectory('apps/admin');

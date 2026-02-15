import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting Chilean Data Seeding...');

    // 1. Roles
    const roles = [
        { name: 'SUPERADMIN', description: 'Acceso total al sistema' },
        { name: 'ADMIN', description: 'Administrador de Sucursal' },
        { name: 'CASHIER', description: 'Operador de Punto de Venta' },
        { name: 'WAREHOUSE_MANAGER', description: 'Control de inventario y recepciones' },
        { name: 'WEB_SALES', description: 'Gestión de Marketplace y pedidos online' },
        { name: 'CLIENT', description: 'Acceso cliente final' },
    ];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: { description: role.description },
            create: { name: role.name, description: role.description },
        });
    }
    console.log('✅ Roles seeded.');

    // 2. Units of Measure
    const units = [
        { name: 'Unidad', abbreviation: 'UN' },
        { name: 'Kilogramo', abbreviation: 'KG' },
        { name: 'Litro', abbreviation: 'L' },
        { name: 'Metro', abbreviation: 'MT' },
        { name: 'Pack', abbreviation: 'PK' },
    ];

    for (const unit of units) {
        const existingUnit = await prisma.unit.findFirst({
            where: { abbreviation: unit.abbreviation, tenantId: null },
        });

        if (existingUnit) {
            await prisma.unit.update({
                where: { id: existingUnit.id },
                data: { name: unit.name },
            });
        } else {
            await prisma.unit.create({
                data: { name: unit.name, abbreviation: unit.abbreviation, tenantId: null },
            });
        }
    }
    console.log('✅ Units of measure seeded.');

    // 3. Regions & Communes (Chile)
    const chileData = [
        {
            name: 'Arica y Parinacota', romanNumber: 'XV', number: 15,
            communes: ['Arica', 'Camarones', 'Putre', 'General Lagos']
        },
        {
            name: 'Tarapacá', romanNumber: 'I', number: 1,
            communes: ['Iquique', 'Alto Hospicio', 'Pozo Almonte', 'Camiña', 'Colchane', 'Huara', 'Pica']
        },
        {
            name: 'Antofagasta', romanNumber: 'II', number: 2,
            communes: ['Antofagasta', 'Mejillones', 'Sierra Gorda', 'Taltal', 'Calama', 'Ollagüe', 'San Pedro de Atacama', 'Tocopilla', 'María Elena']
        },
        {
            name: 'Atacama', romanNumber: 'III', number: 3,
            communes: ['Copiapó', 'Caldera', 'Tierra Amarilla', 'Chañaral', 'Diego de Almagro', 'Vallenar', 'Alto del Carmen', 'Freirina', 'Huasco']
        },
        {
            name: 'Coquimbo', romanNumber: 'IV', number: 4,
            communes: ['La Serena', 'Coquimbo', 'Andacollo', 'La Higuera', 'Paiguano', 'Vicuña', 'Illapel', 'Canela', 'Los Vilos', 'Salamanca', 'Ovalle', 'Combarbalá', 'Monte Patria', 'Punitaqui', 'Río Hurtado']
        },
        {
            name: 'Valparaíso', romanNumber: 'V', number: 5,
            communes: ['Valparaíso', 'Casablanca', 'Concón', 'Juan Fernández', 'Puchuncaví', 'Quintero', 'Viña del Mar', 'Isla de Pascua', 'Los Andes', 'Calle Larga', 'Rinconada', 'San Esteban', 'La Ligua', 'Cabildo', 'Papudo', 'Petorca', 'Zapallar', 'Quillota', 'Calera', 'Hijuelas', 'La Cruz', 'Nogales', 'San Antonio', 'Algarrobo', 'Cartagena', 'El Quisco', 'El Tabo', 'Santo Domingo', 'San Felipe', 'Catemu', 'Llaillay', 'Panquehue', 'Putaendo', 'Santa María', 'Quilpué', 'Limache', 'Olmué', 'Villa Alemana']
        },
        {
            name: 'Metropolitana de Santiago', romanNumber: 'RM', number: 13,
            communes: [
                'Cerrillos', 'Cerro Navia', 'Conchalí', 'El Bosque', 'Estación Central', 'Huechuraba', 'Independencia', 'La Cisterna', 'La Florida', 'La Granja', 'La Pintana', 'La Reina', 'Las Condes', 'Lo Barnechea', 'Lo Espejo', 'Lo Prado', 'Macul', 'Maipú', 'Ñuñoa', 'Pedro Aguirre Cerda', 'Peñalolén', 'Providencia', 'Pudahuel', 'Quilicura', 'Quinta Normal', 'Recoleta', 'Renca', 'San Joaquín', 'San Miguel', 'San Ramón', 'Santiago', 'Vitacura', 'Puente Alto', 'Pirque', 'San José de Maipo', 'San Bernardo', 'Buin', 'Calera de Tango', 'Paine', 'Melipilla', 'Alhué', 'Curacaví', 'María Pinto', 'San Pedro', 'Talagante', 'El Monte', 'Isla de Maipo', 'Padre Hurtado', 'Peñaflor', 'Colina', 'Lampa', 'Tiltil'
            ]
        },
        {
            name: 'Libertador General Bernardo O\'Higgins', romanNumber: 'VI', number: 6,
            communes: ['Rancagua', 'Codegua', 'Coinco', 'Coltauco', 'Doñihue', 'Graneros', 'Las Cabras', 'Machalí', 'Malloa', 'Mostazal', 'Olivar', 'Peumo', 'Pichidegua', 'Quinta de Tilcoco', 'Rengo', 'Requínoa', 'San Vicente', 'Pichilemu', 'La Estrella', 'Litueche', 'Marchihue', 'Navidad', 'Paredones', 'San Fernando', 'Chépica', 'Chimbarongo', 'Lolol', 'Nancagua', 'Palmilla', 'Peralillo', 'Placilla', 'Pumanque', 'Santa Cruz']
        },
        {
            name: 'Maule', romanNumber: 'VII', number: 7,
            communes: ['Talca', 'Constitución', 'Curepto', 'Empedrado', 'Maule', 'Pelarco', 'Pencahue', 'Río Claro', 'San Clemente', 'San Rafael', 'Cauquenes', 'Chanco', 'Pelluhue', 'Curicó', 'Hualañé', 'Licantén', 'Molina', 'Rauco', 'Romeral', 'Sagrada Familia', 'Teno', 'Vichuquén', 'Linares', 'Colbún', 'Longaví', 'Parral', 'Retiro', 'San Javier', 'Villa Alegre', 'Yerbas Buenas']
        },
        {
            name: 'Ñuble', romanNumber: 'XVI', number: 16,
            communes: ['Chillán', 'Bulnes', 'Chillán Viejo', 'El Carmen', 'Pemuco', 'Pinto', 'Quillón', 'San Ignacio', 'Yungay', 'Quirihue', 'Cobquecura', 'Coelemu', 'Ninhue', 'Portezuelo', 'Ránquil', 'Trehuaco', 'San Carlos', 'Coihueco', 'Ñiquén', 'San Fabián', 'San Nicolás']
        },
        {
            name: 'Biobío', romanNumber: 'VIII', number: 8,
            communes: ['Concepción', 'Coronel', 'Chiguayante', 'Florida', 'Hualqui', 'Lota', 'Penco', 'San Pedro de la Paz', 'Santa Juana', 'Talcahuano', 'Tomé', 'Hualpén', 'Lebu', 'Arauco', 'Cañete', 'Contulmo', 'Curanilahue', 'Los Álamos', 'Tirúa', 'Los Ángeles', 'Antuco', 'Cabrero', 'Laja', 'Mulchén', 'Nacimiento', 'Negrete', 'Quilaco', 'Quilleco', 'San Rosendo', 'Santa Bárbara', 'Tucapel', 'Yumbel', 'Alto Biobío']
        },
        {
            name: 'La Araucanía', romanNumber: 'IX', number: 9,
            communes: ['Temuco', 'Carahue', 'Cunco', 'Curarrehue', 'Freire', 'Galvarino', 'Gorbea', 'Lautaro', 'Loncoche', 'Melipeuco', 'Nueva Imperial', 'Padre Las Casas', 'Perquenco', 'Pitrufquén', 'Pucón', 'Saavedra', 'Teodoro Schmidt', 'Toltén', 'Vilcún', 'Villarrica', 'Cholchol', 'Angol', 'Collipulli', 'Curacautín', 'Ercilla', 'Lonquimay', 'Los Sauces', 'Lumaco', 'Purén', 'Renaico', 'Traiguén', 'Victoria']
        },
        {
            name: 'Los Ríos', romanNumber: 'XIV', number: 14,
            communes: ['Valdivia', 'Corral', 'Lanco', 'Los Lagos', 'Máfil', 'Mariquina', 'Paillaco', 'Panguipulli', 'La Unión', 'Futrono', 'Lago Ranco', 'Río Bueno']
        },
        {
            name: 'Los Lagos', romanNumber: 'X', number: 10,
            communes: ['Puerto Montt', 'Calbuco', 'Cochamó', 'Fresia', 'Frutillar', 'Los Muermos', 'Llanquihue', 'Maullín', 'Puerto Varas', 'Castro', 'Ancud', 'Chonchi', 'Curaco de Vélez', 'Dalcahue', 'Puqueldón', 'Queilén', 'Quellón', 'Quemchi', 'Quinchao', 'Osorno', 'Puerto Octay', 'Purranque', 'Puyehue', 'Río Negro', 'San Juan de la Costa', 'San Pablo', 'Chaitén', 'Futaleufú', 'Hualaihué', 'Palena']
        },
        {
            name: 'Aysén del General Carlos Ibáñez del Campo', romanNumber: 'XI', number: 11,
            communes: ['Coyhaique', 'Lago Verde', 'Aysén', 'Cisnes', 'Guaitecas', 'Cochrane', 'OHiggins', 'Tortel', 'Chile Chico', 'Río Ibáñez']
        },
        {
            name: 'Magallanes y de la Antártica Chilena', romanNumber: 'XII', number: 12,
            communes: ['Punta Arenas', 'Laguna Blanca', 'Río Verde', 'San Gregorio', 'Cabo de Hornos', 'Antártica', 'Porvenir', 'Primavera', 'Timaukel', 'Natales', 'Torres del Paine']
        }
    ];

    for (const region of chileData) {
        const dbRegion = await prisma.region.upsert({
            where: { id: region.number.toString() }, // Using number as temporary ID for stability
            update: { name: region.name, romanNumber: region.romanNumber, number: region.number },
            create: { id: region.number.toString(), name: region.name, romanNumber: region.romanNumber, number: region.number },
        });

        for (const communeName of region.communes) {
            await prisma.commune.upsert({
                where: { id: `${region.number}_${communeName.replace(/\s+/g, '_')}` },
                update: { name: communeName, regionId: dbRegion.id },
                create: { id: `${region.number}_${communeName.replace(/\s+/g, '_')}`, name: communeName, regionId: dbRegion.id },
            });
        }
    }
    console.log('✅ Regions and Communes seeded.');

    console.log('🏁 Seeding finished successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

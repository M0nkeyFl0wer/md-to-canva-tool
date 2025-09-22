export const OCEAN_PASTEL_BRANDING = {
    primaryColor: '#7dd3fc', // Sky blue
    secondaryColor: '#a5f3fc', // Light cyan
    accentColor: '#0ea5e9', // Ocean blue
    fontFamily: 'Poppins'
};
export const OCEAN_TEXT_STYLES = [
    {
        element: 'title',
        fontSize: 46,
        fontFamily: 'Poppins',
        color: '#0c4a6e', // Deep ocean blue
        alignment: 'center',
        bold: true
    },
    {
        element: 'subtitle',
        fontSize: 22,
        fontFamily: 'Poppins',
        color: '#0369a1', // Medium ocean blue
        alignment: 'center'
    },
    {
        element: 'body',
        fontSize: 18,
        fontFamily: 'Open Sans',
        color: '#1e293b', // Slate gray
        alignment: 'left'
    },
    {
        element: 'bullet',
        fontSize: 16,
        fontFamily: 'Open Sans',
        color: '#334155', // Dark slate
        alignment: 'left'
    }
];
export const OCEAN_SLIDE_TEMPLATES = [
    {
        type: 'title',
        layout: 'title-center-waves',
        textStyles: OCEAN_TEXT_STYLES,
        backgroundStyle: {
            type: 'gradient',
            value: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)'
        }
    },
    {
        type: 'content',
        layout: 'title-bullets-ocean',
        textStyles: OCEAN_TEXT_STYLES,
        backgroundStyle: {
            type: 'gradient',
            value: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 100%)'
        }
    },
    {
        type: 'image',
        layout: 'image-caption-waves',
        textStyles: OCEAN_TEXT_STYLES,
        backgroundStyle: {
            type: 'color',
            value: '#f8fafc'
        }
    },
    {
        type: 'quote',
        layout: 'quote-center-ocean',
        textStyles: OCEAN_TEXT_STYLES,
        backgroundStyle: {
            type: 'gradient',
            value: 'linear-gradient(45deg, #e0f2fe 0%, #f0f9ff 100%)'
        }
    }
];
export const OCEAN_PASTEL_TEMPLATE = {
    id: 'ocean-pastel',
    name: 'Ocean Waves Pastel',
    description: 'Clean design with ocean wave motifs and soft pastel colors, perfect for marine research presentations',
    slides: OCEAN_SLIDE_TEMPLATES,
    branding: OCEAN_PASTEL_BRANDING
};

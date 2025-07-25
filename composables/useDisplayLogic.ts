export function useDisplayLogic(allRelatedData: globalThis.Ref<Record<string, any[]>>) {
    const getHasOneDisplay = (value: any, fieldProps: Record<string, any>): string => {
        if (!value) return '';
        const { descriptor } = fieldProps;
        if (typeof value === 'object' && value !== null) {
            return value[descriptor] || value.id || '';
        }
        const id = value;
        const { relatedEntityName } = fieldProps;
        if (!relatedEntityName) return String(id);

        const relatedData = allRelatedData.value[relatedEntityName.toLowerCase()];
        if (!relatedData) return String(id);

        const item = relatedData.find(d => d.id === id);
        return item ? item[descriptor] : String(id);
    };

    const getHasManyDisplay = (values: any[], fieldProps: Record<string, any>): string[] => {
        if (!values || values.length === 0) return [];
        return values.map(value => getHasOneDisplay(value, fieldProps));
    };

    return {
        getHasOneDisplay,
        getHasManyDisplay,
    };
}

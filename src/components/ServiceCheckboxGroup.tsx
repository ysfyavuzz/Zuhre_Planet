/**
 * Service Checkbox Group Component
 *
 * Categorized checkbox group for selecting services/offerings.
 * Features collapsible categories, search, and select all functionality.
 *
 * @module components/ServiceCheckboxGroup
 * @category Components - Form
 */

import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronRight, Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICE_CATEGORIES } from '@/types/filter';

interface ServiceCheckboxGroupProps {
  selectedServices?: string[];
  onChange?: (services: string[]) => void;
  className?: string;
}

interface Service {
  id: string;
  label: string;
}

interface ServiceCategory {
  id: string;
  label: string;
  icon: string;
  services: Service[];
}

export function ServiceCheckboxGroup({
  selectedServices = [],
  onChange,
  className = '',
}: ServiceCheckboxGroupProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(SERVICE_CATEGORIES.slice(0, 2).map((c) => c.id))
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Toggle individual service
  const toggleService = (serviceId: string) => {
    const newSelection = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];
    onChange?.(newSelection);
  };

  // Toggle all services in a category
  const toggleCategoryAll = (category: ServiceCategory) => {
    const categoryServiceIds = category.services.map((s) => s.id);
    const allSelected = categoryServiceIds.every((id) =>
      selectedServices.includes(id)
    );

    const newSelection = allSelected
      ? selectedServices.filter((id) => !categoryServiceIds.includes(id))
      : [...new Set([...selectedServices, ...categoryServiceIds])];

    onChange?.(newSelection);
  };

  // Clear all selections
  const clearAll = () => {
    onChange?.([]);
  };

  // Filter categories and services based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return SERVICE_CATEGORIES;

    return SERVICE_CATEGORIES.map((category) => ({
      ...category,
      services: category.services.filter((service) =>
        service.label.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })).filter((category) => category.services.length > 0);
  }, [searchQuery]);

  // Auto-expand categories when searching
  useMemo(() => {
    if (searchQuery.trim()) {
      const allCategoryIds = new Set(filteredCategories.map((c) => c.id));
      setExpandedCategories(allCategoryIds);
    }
  }, [searchQuery, filteredCategories]);

  // Get count of selected services
  const selectedCount = selectedServices.length;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Hizmetler</span>
        </div>
        {selectedCount > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedCount} seçili</Badge>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={clearAll}
            >
              Temizle
            </Button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Hizmet ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {filteredCategories.map((category) => {
          const categoryServiceIds = category.services.map((s) => s.id);
          const selectedInCategory = categoryServiceIds.filter((id) =>
            selectedServices.includes(id)
          ).length;
          const isExpanded = expandedCategories.has(category.id);

          return (
            <Card key={category.id} className="overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{category.icon}</span>
                  <span className="font-medium">{category.label}</span>
                  {selectedInCategory > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedInCategory}/{category.services.length}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategoryAll(category);
                    }}
                  >
                    {selectedInCategory === category.services.length
                      ? 'Kaldır'
                      : 'Seç'}
                  </Button>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Services */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 pt-0 space-y-2">
                      {category.services.map((service) => {
                        const isSelected = selectedServices.includes(service.id);

                        return (
                          <label
                            key={service.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <Checkbox
                              checked={isSelected}
                              onChange={() => toggleService(service.id)}
                            />
                            <span className="text-sm">{service.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* No results */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Arama kriterine uygun hizmet bulunamadı.
        </div>
      )}
    </div>
  );
}

export { ServiceCheckboxGroup as default };

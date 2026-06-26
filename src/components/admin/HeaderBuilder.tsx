"use client";

import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Bars3Icon, ShoppingBagIcon, MagnifyingGlassIcon, UserIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface ItemProps {
  id: string;
  isOverlay?: boolean;
}

const itemConfig: Record<string, { label: string; icon: any }> = {
  menu: { label: 'Menu', icon: Bars3Icon },
  logo: { label: 'Logo', icon: PhotoIcon },
  search: { label: 'Search', icon: MagnifyingGlassIcon },
  account: { label: 'Account', icon: UserIcon },
  cart: { label: 'Cart', icon: ShoppingBagIcon },
};

function SortableItem({ id, isOverlay }: ItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const config = itemConfig[id];
  const Icon = config?.icon;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`flex items-center justify-center p-3 m-1 bg-white border border-gray-200 rounded-lg shadow-sm cursor-grab ${
        isOverlay ? 'shadow-md border-brand-500 scale-105' : ''
      }`}
    >
      {Icon && <Icon className="w-5 h-5 text-gray-500" />}
      {!Icon && <span className="text-sm font-medium text-gray-700">{config?.label || id}</span>}
      {id === 'logo' && <span className="ml-2 text-sm font-medium text-gray-700">Logo</span>}
      {id === 'menu' && <span className="ml-2 text-sm font-medium text-gray-700">Menu</span>}
    </div>
  );
}

function DroppableContainer({ id, items, placeholder }: { id: string, items: string[], placeholder: string }) {
  const { setNodeRef } = useDroppable({ id });
  return (
    <div 
      ref={setNodeRef}
      className="min-h-[80px] p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex items-center flex-wrap"
    >
      <SortableContext items={items} strategy={horizontalListSortingStrategy}>
        {items.map((itemId) => (
          <SortableItem key={itemId} id={itemId} />
        ))}
      </SortableContext>
      {items.length === 0 && (
        <span className="text-gray-400 text-sm italic w-full text-center">{placeholder}</span>
      )}
    </div>
  );
}

interface HeaderBuilderProps {
  activeItems: string[];
  setActiveItems: (items: string[]) => void;
  unwantedItems: string[];
  setUnwantedItems: (items: string[]) => void;
  title: string;
}

export default function HeaderBuilder({
  activeItems,
  setActiveItems,
  unwantedItems,
  setUnwantedItems,
  title
}: HeaderBuilderProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = activeItems.includes(active.id) ? 'active' : 'unwanted';
    const overContainer = activeItems.includes(over.id) ? 'active' : (unwantedItems.includes(over.id) ? 'unwanted' : over.id);

    if (!overContainer || activeContainer === overContainer) {
      return;
    }

    if (activeContainer === 'active') {
      setActiveItems(activeItems.filter(id => id !== active.id));
      setUnwantedItems([...unwantedItems, active.id]);
    } else {
      setUnwantedItems(unwantedItems.filter(id => id !== active.id));
      setActiveItems([...activeItems, active.id]);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeContainer = activeItems.includes(active.id) ? 'active' : 'unwanted';
    const overContainer = activeItems.includes(over.id) ? 'active' : (unwantedItems.includes(over.id) ? 'unwanted' : over.id);

    if (activeContainer && overContainer && activeContainer === overContainer) {
      if (active.id !== over.id) {
        if (activeContainer === 'active') {
          const oldIndex = activeItems.indexOf(active.id);
          const newIndex = activeItems.indexOf(over.id);
          setActiveItems(arrayMove(activeItems, oldIndex, newIndex));
        } else {
          const oldIndex = unwantedItems.indexOf(active.id);
          const newIndex = unwantedItems.indexOf(over.id);
          setUnwantedItems(arrayMove(unwantedItems, oldIndex, newIndex));
        }
      }
    }
  };

  if (!isMounted) {
    return (
      <div className="space-y-6 animate-pulse">
        <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
        <div className="h-20 bg-gray-100 rounded-xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-[15px] font-bold text-gray-900">{title}</h3>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Active Header Items</label>
            <DroppableContainer id="active" items={activeItems} placeholder="Drag items here" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Drop unwanted items here</label>
            <div className="opacity-60">
              <DroppableContainer id="unwanted" items={unwantedItems} placeholder="Drag items here to hide them" />
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeId ? <SortableItem id={activeId} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

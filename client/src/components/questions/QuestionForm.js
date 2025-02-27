import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const QuestionForm = ({ questions, onChange }) => {
  const { t } = useTranslation();
  const [localQuestions, setLocalQuestions] = useState(questions);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(localQuestions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setLocalQuestions(items);
    onChange(items);
  };

  // ... rest of the component
}; 
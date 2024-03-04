// EditButton.jsx
import React from 'react';
import { ReactComponent as EditIcon } from './edit.svg'; 

export const EditButton = ({ isEditMode, onToggleEdit, onSave, onCancel }) => {
  return (
    <div className="edit-post-div">
      {isEditMode ? (
        <>
          <button onClick={onSave} className="edit-post-button">
            Save
          </button>
          <button onClick={onCancel} className="edit-post-button">
            Cancel
          </button>
        </>
      ) : (
        <button onClick={onToggleEdit} className="edit-post-button">
          <EditIcon />
          Edit
        </button>
      )}
    </div>
  );
};

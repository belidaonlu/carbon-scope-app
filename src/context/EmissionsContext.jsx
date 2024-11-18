// src/context/EmissionsContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const EmissionsContext = createContext();

const initialState = {
  entries: [],
  selectedDate: new Date(),
  activeScope: null,
  activeSubcategory: null,
  selectedSource: "",
  formData: {},
  searchTerm: "",
};

const emissionsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ENTRY':
      return {
        ...state,
        entries: [...state.entries, action.payload],
        formData: {
          ...state.formData,
          [action.payload.scopeKey]: {
            ...state.formData[action.payload.scopeKey],
            [action.payload.subKey]: {},
          },
        },
        selectedSource: "",
      };
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.payload),
      };
    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.scopeKey]: {
            ...state.formData[action.payload.scopeKey],
            [action.payload.subKey]: {
              ...(state.formData[action.payload.scopeKey]?.[action.payload.subKey] || {}),
              [action.payload.fieldName]: action.payload.value,
            },
          },
        },
      };
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_SCOPE':
      return { ...state, activeScope: action.payload };
    case 'SET_SUBCATEGORY':
      return { ...state, activeSubcategory: action.payload };
    case 'SET_SOURCE':
      return { ...state, selectedSource: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
};

export const EmissionsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(emissionsReducer, initialState);

  const value = {
    ...state,
    addEntry: (entry) => dispatch({ type: 'ADD_ENTRY', payload: entry }),
    deleteEntry: (id) => dispatch({ type: 'DELETE_ENTRY', payload: id }),
    updateFormData: (scopeKey, subKey, fieldName, value) =>
      dispatch({
        type: 'UPDATE_FORM_DATA',
        payload: { scopeKey, subKey, fieldName, value },
      }),
    setDate: (date) => dispatch({ type: 'SET_DATE', payload: date }),
    setScope: (scope) => dispatch({ type: 'SET_SCOPE', payload: scope }),
    setSubcategory: (subcategory) => dispatch({ type: 'SET_SUBCATEGORY', payload: subcategory }),
    setSource: (source) => dispatch({ type: 'SET_SOURCE', payload: source }),
    setSearchTerm: (term) => dispatch({ type: 'SET_SEARCH_TERM', payload: term }),
  };

  return (
    <EmissionsContext.Provider value={value}>
      {children}
    </EmissionsContext.Provider>
  );
};

export const useEmissions = () => {
  const context = useContext(EmissionsContext);
  if (!context) {
    throw new Error('useEmissions must be used within an EmissionsProvider');
  }
  return context;
};
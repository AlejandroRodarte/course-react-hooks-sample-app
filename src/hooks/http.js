import { useReducer, useCallback } from 'react';

const initialState = {
    loading: false,
    error: null,
    data: null,
    task: { type: 'NOOP' }
};

const reducer = (state, action) => {

    switch (action.type) {

        case 'START':
            return {
                ...state,
                loading: true,
                error: null,
                data: null,
                task: { type: 'NOOP' }
            };

        case 'SUCCESS':
            return {
                ...state,
                loading: false,
                error: null,
                data: action.payload.data,
                task: action.payload.task
            };

        case 'FAIL':
            return {
                ...state,
                loading: false,
                error: action.payload.error,
                data: null,
                task: { type: 'NOOP' }
            };

        case 'CLEAR':
            return {
                ...state,
                error: null,
                data: null,
                task: { type: 'NOOP' }
            };

        default:
            throw new Error('Should not be here.');

    }

};

const useHttp = () => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const clear = useCallback(() => dispatch({ type: 'CLEAR' }), []);

    const sendRequest = useCallback(async (url, method, body, task) => {

        dispatch({ type: 'START' });
    
        try {
    
          const data = await fetch(url, {
            method,
            body,
            headers: {
                'Content-Type': 'application/json'
            }
          });

          const json = await data.json();
      
          dispatch({ type: 'SUCCESS', payload: { data: json, task } });
    
        } catch (e) {
          dispatch({ type: 'FAIL', payload: { error: 'Something went wrong!' } });
        }

    }, []);

    return [state.data, state.error, state.loading, state.task, sendRequest, clear];

};

export default useHttp;

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import DeleteProjectsButton from './index';

import {
  Actions as projectsActions,
  Selectors as projectsSelectors,
  PROJECTS_TYPES,
} from 'store/projects';

import { useIsLoading } from 'hooks';

const { deleteProjectsRequest } = projectsActions;

const { getSelectedProjects } = projectsSelectors;

/**
 * Delete Projects Button Container.
 *
 * This component is responsible for create a logic container for delete projects
 * button with redux.
 */
// TODO: Aparentemente não existe a necessidade de passar os projetos selecionados
// para o componente.
const DeleteProjectsButtonContainer = () => {
  const dispatch = useDispatch();

  const loading = useIsLoading(PROJECTS_TYPES.DELETE_PROJECTS_REQUEST);
  const selectedProjects = useSelector(getSelectedProjects);

  const handleDeleteSelectedProjects = (projects) =>
    dispatch(deleteProjectsRequest(projects));

  return (
    <>
      {selectedProjects?.length > 0 ? (
        <DeleteProjectsButton
          disabled={loading}
          selectedProjects={selectedProjects}
          handleClick={handleDeleteSelectedProjects}
        />
      ) : null}
    </>
  );
};

export default DeleteProjectsButtonContainer;

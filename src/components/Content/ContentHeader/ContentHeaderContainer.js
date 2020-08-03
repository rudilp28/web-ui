// CORE LIBS
import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

// COMPONENTS
import ContentHeader from './index';

// CONTAINERS
import NewProjectButtonContainer from '../ProjectsContent/NewProjectButton/Container';
import DeleteProjectsButtonContainer from '../ProjectsContent/DeleteProjectsButton/Container';

/**
 * Content Header Container.
 * This component is responsible for create a logic container for content header
 * with route control.
 *
 * @param props
 */
const ContentHeaderContainer = (props) => {
  // destructuring props
  const { title, subTitle } = props;

  // getting history
  const history = useHistory();

  // HANDLERS
  const goBackHandler = () => history.goBack();

  // RENDER
  return (
    <ContentHeader
      title={title}
      subTitle={subTitle}
      loading={false}
      handleGoBack={goBackHandler}
      extra={
        title === 'Meus projetos' && (
          <>
            {/* new project button */}
            <NewProjectButtonContainer />
            {/* delete projects button */}
            <DeleteProjectsButtonContainer />
          </>
        )
      }
    />
  );
};

// PROP TYPES
ContentHeaderContainer.propTypes = {
  /** content header title */
  title: PropTypes.string.isRequired,
};

// EXPORT
export default ContentHeaderContainer;

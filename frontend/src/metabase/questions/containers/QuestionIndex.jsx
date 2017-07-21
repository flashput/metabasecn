import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import cx from "classnames";

import Icon from "metabase/components/Icon";
import Button from "metabase/components/Button";
import TitleAndDescription from "metabase/components/TitleAndDescription";

import ExpandingSearchField from "../components/ExpandingSearchField";
import CollectionActions from "../components/CollectionActions";

import CollectionButtons from "../components/CollectionButtons"

import EntityList from "./EntityList";

import { search } from "../questions";
import { loadCollections } from "../collections";
import { getLoadingInitialEntities, getAllCollections, getAllEntities } from "../selectors";
import { getUserIsAdmin } from "metabase/selectors/user";

import { replace, push } from "react-router-redux";
import EmptyState from "metabase/components/EmptyState";
import LoadingAndErrorWrapper from "metabase/components/LoadingAndErrorWrapper";

export const CollectionEmptyState = () =>
    <div className="flex align-center p2 mt4 bordered border-med border-brand rounded bg-grey-0 text-brand">
        <Icon name="collection" size={32} className="mr2"/>
        <div className="flex-full">
            <h3>创建您的问题集合</h3>
            <div className="mt1">
                问题集合用于管理您的问题，并且可以设置权限
                {" "}
                <a href="http://www.metabase.com/docs/latest/administration-guide/06-collections.html" target="_blank">
                    查看帮助
                </a>
            </div>
        </div>
        <Link to="/collections/create">
            <Button primary>创建问题集</Button>
        </Link>
    </div>;

export const NoSavedQuestionsState = () =>
    <div className="flex-full flex align-center justify-center mb4">
        <EmptyState
            message={<span>Explore your data, create charts or maps, and save what you find.</span>}
            image="/app/img/questions_illustration"
            action="Ask a question"
            link="/question"
        />
    </div>;

export const QuestionIndexHeader = ({questions, collections, isAdmin, onSearch}) => {
    // Some replication of logic for making writing tests easier
    const hasCollections = collections && collections.length > 0;
    const hasQuestionsWithoutCollection = questions && questions.length > 0;

    const showSearch = hasCollections || hasQuestionsWithoutCollection;
    const showSetPermissionsLink = isAdmin && hasCollections;

    return (<div className="flex align-center pt4 pb2">
        <TitleAndDescription title={ hasCollections ? "问题集合" : "保存的问题" }/>

        <div className="flex align-center ml-auto">
            { showSearch &&
            <ExpandingSearchField className="mr2" onSearch={onSearch}/>
            }

            <CollectionActions>
                { showSetPermissionsLink &&
                <Link to="/collections/permissions">
                    <Icon size={18} name="lock" tooltip="为问题集合设置权限"/>
                </Link>
                }
                <Link to="/questions/archive">
                    <Icon size={20} name="viewArchive" tooltip="查看已归档问题"/>
                </Link>
            </CollectionActions>
        </div>
    </div>);
};

const mapStateToProps = (state, props) => ({
    loading:     getLoadingInitialEntities(state, props),
    questions:   getAllEntities(state, props),
    collections: getAllCollections(state, props),
    isAdmin:     getUserIsAdmin(state, props)
});

const mapDispatchToProps = ({
    search,
    loadCollections,
    replace,
    push,
});

/* connect() is in the end of this file because of the plain QuestionIndex component is used in Jest tests */
export class QuestionIndex extends Component {
    componentWillMount() {
        this.props.loadCollections();
    }

    render () {
        const { loading, questions, collections, replace, push, location, isAdmin } = this.props;

        const hasCollections = collections && collections.length > 0;
        const hasQuestionsWithoutCollection = questions && questions.length > 0;

        const showNoCollectionsState = !loading && isAdmin && !hasCollections;
        const showNoSavedQuestionsState = !loading && !hasCollections && !hasQuestionsWithoutCollection;

        const hasEntityListSectionQuery = !!(location.query && location.query.f);
        const showEntityList = hasQuestionsWithoutCollection || hasEntityListSectionQuery;
        const showEverythingElseTitle = showEntityList && hasCollections;

        return (
            <div className={cx("relative px4", {"full-height flex flex-column bg-slate-extra-light": showNoSavedQuestionsState})}>
                {/* Use loading wrapper only for displaying the loading indicator as EntityList component should always be in DOM */}
                { loading && <LoadingAndErrorWrapper loading={true} noBackground /> }

                { showNoCollectionsState && <CollectionEmptyState /> }

                { !loading && <QuestionIndexHeader
                    questions={questions}
                    collections={collections}
                    isAdmin={isAdmin}
                    onSearch={this.props.search}
                /> }

                { hasCollections && <CollectionButtons collections={collections} isAdmin={isAdmin} push={push} /> }

                { showNoSavedQuestionsState && <NoSavedQuestionsState /> }

                { showEverythingElseTitle && <h2 className="mt2 mb2">其他所有没归类的问题</h2> }

                <div className={cx({ "hide": !showEntityList })}>
                    {/* EntityList loads `questions` according to the query specified in the url query string */}
                    <EntityList
                        entityType="cards"
                        entityQuery={{f: "all", collection: "", ...location.query}}
                        // use replace when changing sections so back button still takes you back to collections page
                        onChangeSection={(section) => replace({
                            ...location,
                            query: {...location.query, f: section}
                        })}
                    />
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionIndex);


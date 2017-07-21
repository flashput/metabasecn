import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import pure from "recompose/pure";

import S from "./EditHeader.css";

import RevisionMessageModal from "metabase/reference/components/RevisionMessageModal.jsx";

const EditHeader = ({
    hasRevisionHistory,
    endEditing,
    reinitializeForm = () => undefined,
    submitting,
    onSubmit,
    revisionMessageFormField
}) =>
    <div className={cx("EditHeader wrapper py1", S.editHeader)}>
        <div>
            您正在编辑这个页面
        </div>
        <div className={S.editHeaderButtons}>
            { hasRevisionHistory ?
                <RevisionMessageModal
                    action={() => onSubmit()}
                    field={revisionMessageFormField}
                    submitting={submitting}
                >
                    <button
                        className={cx("Button", "Button--primary", "Button--white", "Button--small", S.saveButton)}
                        type="button"
                        disabled={submitting}
                    >
                        保存
                    </button>
                </RevisionMessageModal> :
                <button
                    className={cx("Button", "Button--primary", "Button--white", "Button--small", S.saveButton)}
                    type="submit"
                    disabled={submitting}
                >
                    保存
                </button>
            }

            <button
                type="button"
                className={cx("Button", "Button--white", "Button--small", S.cancelButton)}
                onClick={() => {
                    endEditing();
                    reinitializeForm();
                }}
            >
                CANCEL
            </button>
        </div>
    </div>;
EditHeader.propTypes = {
    hasRevisionHistory: PropTypes.bool,
    endEditing: PropTypes.func.isRequired,
    reinitializeForm: PropTypes.func,
    submitting: PropTypes.bool.isRequired,
    onSubmit: PropTypes.func,
    revisionMessageFormField: PropTypes.object
};

export default pure(EditHeader);

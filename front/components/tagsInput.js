import React from 'react'
import BulmaTagsInput from '@creativebulma/bulma-tagsinput'
import { BulmaTagsInputOptions } from '@creativebulma/bulma-tagsinput'
import 'styles/components/tagsInput.module.scss'

/**
 * @typedef {object} TagsInputState
 * @property {string} label
 * @property {BulmaTagsInputOptions} options
 */
/**
 * @typedef {object} TagsInputProps
 * @property {string} id
 */
/**
 * @link https://codepen.io/CreativeBulma/pen/PoPJVQx
 * @extends {React.Component<BulmaTagsInputOptions & TagsInputProps, TagsInputState>}
 */
class TagsInput extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            label: props.label || '',

            options: {
                allowDuplicates: props.allowDuplicates || false,
                caseSensitive: props.caseSensitive || true,
                clearSelectionOnTyping: props.clearSelectionOnTyping || false,
                closeDropdownOnItemSelect: props.closeDropdownOnItemSelect || true,
                delimiter: props.delimiter || ',',
                freeInput: props.freeInput || true,
                highlightDuplicate: props.highlightDuplicate || true,
                highlightMatchesString: props.highlightMatchesString || true,
                itemValue: props.itemValue || undefined,
                itemText: props.itemText || undefined,
                maxTags: props.maxTags || undefined,
                maxChars: props.maxChars || undefined,
                minChars: props.minChars || 1,
                noResultsLabel: props.noResultsLabel || 'No results found',
                placeholder: props.placeholder || '',
                removable: props.removable || true,
                searchMinChars: props.searchMinChars || 1,
                searchOn: props.searchOn || 'text',
                selectable: props.selectable || true,
                source: props.source || undefined,
                tagClass: props.tagClass || 'is-rounded',
                trim: props.trim || true
            }
        };
        this.ref = React.createRef()
    }

    componentDidMount() {
        this.tagsInput = new BulmaTagsInput(this.ref.current, this.state.options);
    }

    render() {
        const { label, value } = this.state;
        const { id, placeholder } = this.props;

        return (
            <div className="field">
                <label className="label">{label}</label>
                <div className="control">
                    <input ref={this.ref} id={id} type="text" placeholder={placeholder} value={value} />
                </div>
            </div>
        );
    }
}
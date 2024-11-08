import { default as Popover } from './utils/popover';
/**
 * Toolbox is a menu for manipulation of rows/cols
 *
 * It contains toggler and Popover:
 *   <toolbox>
 *     <toolbox-toggler />
 *     <popover />
 *   <toolbox>
 */
export default class Toolbox {
    /**
     * Style classes
     */
    static get CSS(): {
        toolbox: string;
        toolboxShowed: string;
        toggler: string;
    };
    /**
     * Creates toolbox buttons and toolbox menus
     *
     * @param {object} api - Editor.js api
     * @param {PopoverItem[]} items - Editor.js api
     * @param {function} onOpen - callback fired when the Popover is opening
     * @param {function} onClose - callback fired when the Popover is closing
     * @param {string} [cssModifier] - the modifier for the Toolbox. Allows to add some specific styles.
     */
    constructor({ api, items, onOpen, onClose, cssModifier }: object);
    api: any;
    items: any;
    onOpen: any;
    onClose: any;
    cssModifier: any;
    popover: Popover;
    wrapper: Element;
    /**
     * Returns rendered Toolbox element
     */
    get element(): Element;
    /**
     * Creating a toolbox to open menu for a manipulating columns
     *
     * @returns {Element}
     */
    createToolbox(): Element;
    /**
     * Creates the Toggler
     *
     * @returns {Element}
     */
    createToggler(): Element;
    /**
     * Creates the Popover instance and render it
     *
     * @returns {Element}
     */
    createPopover(): Element;
    /**
     * Toggler click handler. Opens/Closes the popover
     *
     * @returns {void}
     */
    togglerClicked(): void;
    /**
     * Shows the Toolbox
     *
     * @param {function} computePositionMethod - method that returns the position coordinate
     * @returns {void}
     */
    show(computePositionMethod: Function): void;
    /**
     * Hides the Toolbox
     *
     * @returns {void}
     */
    hide(): void;
}

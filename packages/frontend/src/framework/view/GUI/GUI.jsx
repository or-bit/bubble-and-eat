import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import BarChart from './BarChart/BarChart';
import Button from './Button/Button';
import CheckBox from './CheckButton/CheckBox';
import CheckBoxGroup from './CheckButton/CheckBoxGroup';
import Image from './Image/Image';
import InputText from './InputText/InputText';
import InputFile from './InputFile/InputFile';
import Label from './Label/Label';
import PieChart from './PieChart/PieChart';
import RadioButton from './RadioButton/RadioButton';
import RadioButtonGroup from './RadioButton/RadioButtonGroup';
import TextEdit from './TextEdit/TextEdit';
import TextView from './TextView/TextView';

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'GUIComponent';
}
/**
 * HOC Props-Proxy pattern.
 * @param WrappedComponent
 * @returns {GUI}
 */
export default function gui(WrappedComponent) {
    class GUI extends React.Component {
        render() {
            return <WrappedComponent {...this.props} />;
        }
    }
    GUI.displayName = `GUI(${getDisplayName(WrappedComponent)})`;
    hoistNonReactStatic(GUI, WrappedComponent);
    return GUI;
}

const barChart = gui(BarChart);
const button = gui(Button);
const checkBoxGroup = gui(CheckBoxGroup);
const checkBox = gui(CheckBox);
const image = gui(Image);
const inputFile = gui(InputFile);
const inputText = gui(InputText);
const label = gui(Label);
const pieChart = gui(PieChart);
const radioButton = gui(RadioButton);
const radioButtonGroup = gui(RadioButtonGroup);
const textEdit = gui(TextEdit);
const textView = gui(TextView);

export {
    barChart as BarChart,
    button as Button,
    checkBoxGroup as CheckBoxGroup,
    checkBox as CheckBox,
    image as Image,
    inputFile as InputFile,
    inputText as InputText,
    label as Label,
    pieChart as PieChart,
    radioButton as RadioButton,
    radioButtonGroup as RadioButtonGroup,
    textEdit as TextEdit,
    textView as TextView,
};

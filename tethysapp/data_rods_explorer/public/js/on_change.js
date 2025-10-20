const mapDisabledMessage = ' doesa not support the "Display Map" function, ' +
    'but data rods data can still be obtained under the "Plot one variable", "Compare two variables", ' +
    'or "Year-on-year changes" options.';

const plotDisabledMessage = ' does not support the "Plot one variable", "Compare two variables", ' +
    'or "Year-on-year changes" functions, but data rods data can still be obtained under the "Display Map" option.';

const modelFlashMessages = {
    'NLDAS': {
        'id': 'NLDAS-get-map-disabled',
        'text': 'NLDAS ' + mapDisabledMessage,
        'disable': '#btnDisplayMap'
    },
    'AMSRED' : {
        'id': 'AMSRED-get-plot-disabled',
        'text': 'LPRM-AMSRE-D ' + plotDisabledMessage,
        'disable': '.btn-plot'
    },
    'AMSREA': {
        'id': 'AMSREA-get-plot-disabled',
        'text': 'LPRM-AMSRE-A ' + plotDisabledMessage,
        'disable': '.btn-plot'
    },
    'AMSR2D10' : {
        'id': 'AMSR2D10-get-plot-disabled',
        'text': 'LPRM-AMSR2-D 10km' + plotDisabledMessage,
        'disable': '.btn-plot'
    },
    'AMSR2A10' : {
        'id': 'AMSR2A10-get-plot-disabled',
        'text': 'LPRM-AMSR2-A 10km' + plotDisabledMessage,
        'disable': '.btn-plot'
    },
    'AMSR2D25' : {
        'id': 'AMSR2D25-get-plot-disabled',
        'text': 'LPRM-AMSR2-D 25km' + plotDisabledMessage,
        'disable': '.btn-plot'
    },
    'AMSR2A25' : {
        'id': 'AMSR2A25-get-plot-disabled',
        'text': 'LPRM-AMSR2-A 25km' + plotDisabledMessage,
        'disable': '.btn-plot'
    },
    'TMIDY' : {
        'id': 'TMIDY-get-plot-disabled',
        'text': 'LPRM-TMI-Day' + plotDisabledMessage,
        'disable': '.btn-plot'
    },
    'TMINT' : {
        'id': 'TMINT-get-plot-disabled',
        'text': 'LPRM-TMI-Night' + plotDisabledMessage,
        'disable': '.btn-plot'
    }, 
    'TRMM' : {
        'id': 'TRMM-get-plot-disabled',
        'text': 'TRMM' + plotDisabledMessage,
        'disable': '.btn-plot'
    }
}

const disableButtons = Object.values(modelFlashMessages).map(msg => msg.disable);
const messageIds = Object.values(modelFlashMessages).map(msg => msg.id);

function oc_model() {
    var href;
    var GET = getUrlVars();
    var model = $('#model1').val();

    // All datepickers (plotTime, startDate`, endDate), the model and variable are affected by this change event. Everything else stays the same.
    updateFences('1', model); // The "1" refers to "Model 1". Thus Model 1's fences will be updated.
    GET['model'] = model;
    GET['map_variable'] = VAR_DICT[model][0].value; //1st element
    GET['plot_variable'] = VAR_DICT[model][0].variable;
    GET['plotTime'] = dateHourPickerToRodsDate($('#plot_date').val(), $('#plot_hour').val());

    if ($('#endDate1').val()) {
        GET['endDate'] = dateHourPickerToRodsDate($('#endDate1').val(), '23');
    }

    if ($('#startDate1').val()) {
        GET['startDate'] = dateHourPickerToRodsDate($('#startDate1').val(), '00');
    }

    href = constructHref(GET);
    history.pushState("", "", href);
    loadVariableOptions('model', 'variable');
    validateClickPoint();

    disableButtons.forEach(function (buttonSelector) {
        $(buttonSelector).prop('disabled', false);
    });

    messageIds.forEach(function (msgId) {
        removeFlashMessage(msgId);
    });

    Object.keys(modelFlashMessages).forEach(function (modelKey) {
        if (model.includes(modelKey)) {
            var flashMessage = modelFlashMessages[modelKey];
            $(flashMessage.disable).prop('disabled', true);
            displayFlashMessage(flashMessage.id, 'info', flashMessage.text);
        }
    });
}

function oc_variable() {
    var href;
    var GET = getUrlVars();

    // Only the variable is affected by this change event. Everything else stays the same.
    var $selectedOption = $('#variable option:selected');
    GET['map_variable'] = $selectedOption.data('wms-name');
    GET['plot_variable'] = $selectedOption.data('variable-name');

    href = constructHref(GET);
    history.pushState("", "", href);
}

function oc_map_dt() {
    var href;
    var GET = getUrlVars();
    var $datePickerObj = $('#plot_date');
    var isValid = validateDateFormat($datePickerObj);

    if (isValid) {

        // Only the plotTime is affected by this change event. Everything else stays the same.
        GET['plotTime'] = dateHourPickerToRodsDate($datePickerObj.val(), $('#plot_hour').val());

        href = constructHref(GET);
        history.pushState("", "", href);
    }
}

function oc_sten_dt(datePickerID) {
    var href;
    var GET = getUrlVars();
    var differentiator = datePickerID[datePickerID.length - 1];
    var $startDate = $('#startDate' + differentiator);
    var $endDate = $('#endDate' + differentiator);
    var $datePickerObj = $('#' + datePickerID);
    var isValid = validateDateFormat($datePickerObj);

    if (isValid) {
        // Always have both startDates (model 1 and 2) and both endDates (model 1 and 2) match
        $('.' + datePickerID.slice(0, -1)).val($datePickerObj.val());


        GET['startDate'] = dateHourPickerToRodsDate($startDate.val(), '00'); //First hour
        GET['endDate'] = dateHourPickerToRodsDate($endDate.val(), '23'); //Last hour

        href = constructHref(GET);
        history.pushState("", "", href);

        if (datePickerID.indexOf('endDate') !== -1) {
            $startDate.datepicker('setEndDate', $datePickerObj.val());
        }
    }
}

function oc_model2() {
    var href;
    var GET = getUrlVars();
    var model2 = $('#model2').val();

    updateFences('2', model2);
    GET['model2'] = model2;
    GET['map_variable2'] = VAR_DICT[model2][0].value; //1st element
    GET['plot_variable2'] = VAR_DICT[model2][0].variable;
    var endDate = dateHourPickerToRodsDate($('#endDate2').val(), '23');
    var startDate = dateHourPickerToRodsDate($('#startDate2').val(), '00');

    GET['endDate'] = endDate;
    GET['startDate'] = startDate;

    href = constructHref(GET);
    history.pushState("", "", href);
    loadVariableOptions('model2', 'variable2');
    validateClickPoint();
}

function oc_variable2() {
    var href;
    var GET = getUrlVars();

    // Only variable2 is affected by this change event. Everything else stays the same.
    GET['variable2'] = $('#variable2').val();

    href = constructHref(GET);
    history.pushState("", "", href);
}

function oc_years() {
    var href;
    var GET = getUrlVars();

    var yearsList = $('#years').val();

    if (yearsList && yearsList.length > 0) {
        GET['years'] = yearsList.join(',');
        validateClickPoint();
    } else {
        $('a[name=years]').addClass('disabled');
    }

    href = constructHref(GET);
    history.pushState("", "", href)
}

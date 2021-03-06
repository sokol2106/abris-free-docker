import { Selector } from 'testcafe';
import URL, { Page } from '../modules/page-model';

const url = new URL();

fixture `Abris-free`
    .page(url.home);

const page = new Page();

test('Abris install', async t => {
	var nameTest = "abris_install";
	await t
        .resizeWindow(1366, 768)
        .navigateTo(url.install)
        // .click(Selector('div.abris-property.readwrite').find('input[data-bind="value: $data.serverPassword"]'))
        // .pressKey('ctrl+a')
        // .typeText(Selector('div.abris-property.readwrite').find('input[data-bind="value: $data.serverPassword"]'),
        //     '123456')
        // .click(Selector('abris-bool.abris-property-createDatabase').find('input'))
        .takeScreenshot("/" + nameTest + "_1.png")
        .click(Selector('button.btn.btn-default.btn-green.abris-action-right').withText('Install'))
        .wait(10000)
        .expect(Selector('iframe #document body').withText('Install completed'))
            .ok('Install failed.') // Возможно не совсем верно работает.
        // .hover(Selector('iframe #document body').withText('Install completed'))
        .takeScreenshot("/" + nameTest + "_2.png");
});

test('Login', async t => {
	var nameTest = "login";
	await t
		.resizeWindow(800, 600)
		.navigateTo(url.login)
        // .takeScreenshot("/" + nameTest + "_1.png")
        .wait(750)
		.typeText(Selector('.authForm .row').find('input.form-control[data-bind="value: $data.usename, valueUpdate: \\\'keyup\\\'"]'),
			'postgres')
		.typeText(Selector('.authForm .row').find('input.form-control[data-bind="value: $data.passwd"]'),
			'123456')
		.click(Selector('.authForm .er-actions-row .col-lg-12.actions').find('button.btn.btn-default.btn-green.abris-action-right'))
		.expect(page.loginMenu.innerText)
			.eql('postgres');
		// .takeScreenshot("/" + nameTest + "_2.png");
});

test('Logout', async t => {
	var nameTest = "logout";
	t.expect(page.login());	
	await t
		.resizeWindow(800, 600)
		.expect(page.loginMenu.innerText)
			.eql('postgres', {timeout: 5000});
	await t
		.navigateTo(url.home)
		.eval(() => location.reload(true));
	await t
		.navigateTo(url.login)
		// .takeScreenshot("/" + nameTest + "_1.png")
		.click(Selector('.authLogoutForm .er-actions-row .col-lg-12.actions').find('button.btn.btn-default.btn-green.abris-action-right'))
		.expect(page.loginMenu.innerText)
			.eql('Вход')		
		// .takeScreenshot("/" + nameTest + "_2.png");
});

test('Create schema', async t => {
    var nameTest = "create_schema";
    t.expect(page.login());
    await t
        .resizeWindow(1366, 768)
        .navigateTo(url.schema)
        .click(Selector('.dt-buttons').find('.btn-default.btn-blue'))
        .typeText(Selector('div.abris-property-schema_name').find('input'), 
            'test_schema')
        .typeText(Selector('div.abris-property-title').find('input'), 
            'Test created schema')
        .click(Selector('div.abris-detail-schema div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create'))
        .expect(Selector('div.alert.in.fade.alert-success'))
            .ok('Record not created.')
        // .takeScreenshot("/" + nameTest + "_1.png");
    await t
        .navigateTo(url.home)
        .navigateTo(url.schema)
        .eval(() => location.reload(true));
    await t
        .expect(Selector('div.table-responsive').find('tbody').find('tr').withText('test_schema').exists)
            .ok('Record not displayed.')
        .click(Selector('div.table-responsive').find('tbody').find('tr').withText('test_schema'))
        // .hover(Selector('div.abris-detail-schema').find('div.col-lg-12.actions').nth(1))
        // .takeScreenshot("/" + nameTest + "_2.png");
});

// Нужны скрины.
test('Create project table', async t => {
    var nameTest = "project_table";
    t.expect(page.login());
    await t
        .resizeWindow(1366, 768)
        .click(page.generalMenu)
        .click(Selector('ul#side-menu.nav li').withText('Configuration'))
        .click(Selector('ul.nav.nav-second-level li').withText('Schemas'))
        .click(Selector('div.table-responsive tbody').find('tr#test_schema'));
    if (await Selector('div.panel-heading.clearfix.collapsed').withText('Entities').exists) {
        await t.click(Selector('.panel-heading-caption.left').withText('Entities'))
    }
    await t
        .click(Selector('div.abris-detail-schema div.panel.panel-default').find('div.dt-buttons .btn-default.btn-blue'))
        .typeText(Selector('div.abris-detail-entity .abris-property-table_name').find('input'), 
            'project')
        .typeText(Selector('div.abris-detail-entity .abris-property-title').find('input'),
            'Project')
        // .click(Selector('div.panel.panel-default div.abris-detail-entity abris-actions div.row.er-actions-row div.col-lg-12.actions').find('button.btn.btn-default.btn-green'))
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create')) // Временное решение, не видит кнопку.
        .click(Selector('div.panel.panel-default div.table-responsive tbody').find('tr').nth(0));
    if (await Selector('div.panel-heading.clearfix.collapsed').withText('Properties').exists) {
        await t.click(Selector('.panel-heading-caption.left').withText('Properties'))
    }
    await t
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default').find('div.dt-buttons .btn-default.btn-blue'))
        .typeText(Selector('div.abris-detail-property .abris-property-column_name').find('input'),
            'name')
        .typeText(Selector('div.abris-detail-property .abris-property-title').find('input'),
            'Name')
        .click(Selector('div.abris-detail-property .abris-property-data_type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'text')
        .click(Selector('.select2-results__option').withText('text'))
        .click(Selector('div.abris-detail-property .abris-property-type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'caption')
        .click(Selector('.select2-results__option').withText('caption Headline'))        
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default div.abris-detail-property div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create'));
});

test('Project menu item', async t => {
    var nameTest = "project_menu_item";
    t.expect(page.login());
    await t
        .resizeWindow(1366, 768)
        .navigateTo(url.home + '/#list/menu_item')
        .click(Selector('.dt-buttons').find('.btn-default.btn-blue'))
        .typeText(Selector('.abris-property-name').find('input'), 
            'test_project')
        .typeText(Selector('.abris-property-title').find('input'), 
            'Test Project')
        .click(Selector('div.abris-detail-menu_item .abris-property-projection').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'project')
        .click(Selector('.select2-results__option').withText('public standard public schema project Projects project_key'))
        .click(Selector('div.abris-detail-schema div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create'))
        .expect(Selector('div.alert.in.fade.alert-success'))
            .ok('Record not created.')
        // .takeScreenshot("/" + nameTest + "_1.png");
    await t
        .navigateTo(url.home)
        .eval(() => location.reload(true));
    await t
        .click(page.generalMenu)
        .click(Selector('ul#side-menu.nav li').withText('Test Project'))
        .expect(Selector('div.table-responsive').exists)
            .ok('Project table not displayed.')
        // .takeScreenshot("/" + nameTest + "_2.png");
});

// Нужны скрины
test('Create employee table', async t => {
    var nameTest = "employee_table";
    t.expect(page.login());
    await t
        .resizeWindow(1366, 768)
        .click(page.generalMenu)
        .click(Selector('ul#side-menu.nav li').withText('Configuration'))
        .click(Selector('ul.nav.nav-second-level li').withText('Schemas'))
        .click(Selector('div.table-responsive tbody').find('tr#test_schema'));
    if (await Selector('div.panel-heading.clearfix.collapsed').withText('Entities').exists) {
        await t.click(Selector('.panel-heading-caption.left').withText('Entities'))
    }
    await t
        .click(Selector('div.abris-detail-schema div.panel.panel-default').find('div.dt-buttons .btn-default.btn-blue'))
        .typeText(Selector('div.abris-detail-entity .abris-property-table_name').find('input'), 
            'employee')
        .typeText(Selector('div.abris-detail-entity .abris-property-title').find('input'),
            'Employees')
        // .click(Selector('div.panel.panel-default div.abris-detail-entity abris-actions div.row.er-actions-row div.col-lg-12.actions').find('button.btn.btn-default.btn-green'))
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create')) // Временное решение, не видит кнопку.
        .click(Selector('div.panel.panel-default div.table-responsive tbody').find('tr').nth(0));
    if (await Selector('div.panel-heading.clearfix.collapsed').withText('Properties').exists) {
        await t.click(Selector('.panel-heading-caption.left').withText('Properties'))
    }
    await t
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default').find('div.dt-buttons .btn-default.btn-blue'))
        .typeText(Selector('div.abris-detail-property .abris-property-column_name').find('input'),
            'name')
        .typeText(Selector('div.abris-detail-property .abris-property-title').find('input'),
            'Name')
        // .click(Selector('div.abris-detail-property .abris-property-data_type').find('.select2-selection.select2-selection--single'))
        // .typeText(Selector('.select2-search__field'), 
        //     'text')
        // .click(Selector('.select2-results__option').withText('text'))
        // .click(Selector('div.abris-detail-property .abris-property-type').find('.select2-selection.select2-selection--single'))
        // .typeText(Selector('.select2-search__field'), 
        //     'caption')
        // .click(Selector('.select2-results__option').withText('caption Headline'))        
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default div.abris-detail-property div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create'));
    await t
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default').find('div.dt-buttons .btn-default.btn-blue'))
        .typeText(Selector('div.abris-detail-property .abris-property-column_name').find('input'),
            'work_from')
        .typeText(Selector('div.abris-detail-property .abris-property-title').find('input'),
            'Work From')
        .click(Selector('div.abris-detail-property .abris-property-data_type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'time with time zone')
        .click(Selector('.select2-results__option').withText('time with time zone'))
        .click(Selector('div.abris-detail-property .abris-property-type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'time')
        .click(Selector('.select2-results__option').withText('time Time'))        
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default div.abris-detail-property div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create'));
    await t
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default').find('div.dt-buttons .btn-default.btn-blue'))
        .typeText(Selector('div.abris-detail-property .abris-property-column_name').find('input'),
            'work_to')
        .typeText(Selector('div.abris-detail-property .abris-property-title').find('input'),
            'Work To')
        .click(Selector('div.abris-detail-property .abris-property-data_type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'time with time zone')
        .click(Selector('.select2-results__option').withText('time with time zone'))
        .click(Selector('div.abris-detail-property .abris-property-type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'time')
        .click(Selector('.select2-results__option').withText('time Time'))        
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default div.abris-detail-property div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create'));
});

test('Employee menu item', async t => {
    var nameTest = "employee_menu_item";
    t.expect(page.login());
    await t
        .resizeWindow(1366, 768)
        .navigateTo(url.home + '/#list/menu_item')
        .click(Selector('.dt-buttons').find('.btn-default.btn-blue'))
        .typeText(Selector('.abris-property-name').find('input'), 
            'test_employee')
        .typeText(Selector('.abris-property-title').find('input'), 
            'Test Employee')
        .click(Selector('div.abris-detail-menu_item .abris-property-projection').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'employee')
        .click(Selector('.select2-results__option').withText('public standard public schema employee Employees employee_key'))
        .click(Selector('div.abris-detail-schema div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create'))
        .expect(Selector('div.alert.in.fade.alert-success'))
            .ok('Record not created.')
        // .takeScreenshot("/" + nameTest + "_1.png");
    await t
        .navigateTo(url.home)
        .eval(() => location.reload(true));
    await t
        .click(page.generalMenu)
        .click(Selector('ul#side-menu.nav li').withText('Test Employee'))
        .expect(Selector('div.table-responsive').exists)
            .ok('Employee table not displayed.')
        // .takeScreenshot("/" + nameTest + "_2.png");
});

test('Create task table', async t => {
    var nameTest = "task_table";
    t.expect(page.login());
    await t
        .resizeWindow(1366, 768)
        .click(page.generalMenu)
        .click(Selector('ul#side-menu.nav li').withText('Configuration'))
        .click(Selector('ul.nav.nav-second-level li').withText('Schemas'))
        .click(Selector('div.table-responsive tbody').find('tr#test_schema'));
    if (await Selector('div.panel-heading.clearfix.collapsed').withText('Entities').exists) {
        await t.click(Selector('.panel-heading-caption.left').withText('Entities'))
    }
    await t
        .click(Selector('div.abris-detail-schema div.panel.panel-default').find('div.dt-buttons .btn-default.btn-blue'))
        .typeText(Selector('div.abris-detail-entity .abris-property-table_name').find('input'), 
            'task')
        .typeText(Selector('div.abris-detail-entity .abris-property-title').find('input'),
            'Tasks')
        // .click(Selector('div.panel.panel-default div.abris-detail-entity abris-actions div.row.er-actions-row div.col-lg-12.actions').find('button.btn.btn-default.btn-green'))
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create')) // Временное решение, не видит кнопку.
        .click(Selector('div.panel.panel-default div.table-responsive tbody').find('tr').nth(0));
    if (await Selector('div.panel-heading.clearfix.collapsed').withText('Properties').exists) {
        await t.click(Selector('.panel-heading-caption.left').withText('Properties'))
    }
    await t
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default').find('div.dt-buttons .btn-default.btn-blue'))
        .typeText(Selector('div.abris-detail-property .abris-property-column_name').find('input'),
            'title')
        .typeText(Selector('div.abris-detail-property .abris-property-title').find('input'),
            'Title')
        .click(Selector('div.abris-detail-property .abris-property-data_type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'text')
        .click(Selector('.select2-results__option').withText('text'))
        .click(Selector('div.abris-detail-property .abris-property-type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'caption')
        .click(Selector('.select2-results__option').withText('caption Headline'))        
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default div.abris-detail-property div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create'));
    await t
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default').find('div.dt-buttons .btn-default.btn-blue'))
        .typeText(Selector('div.abris-detail-property .abris-property-column_name').find('input'),
            'due_time')
        .typeText(Selector('div.abris-detail-property .abris-property-title').find('input'),
            'Due Time')
        .click(Selector('div.abris-detail-property .abris-property-data_type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'timestamp with time zone')
        .click(Selector('.select2-results__option').withText('timestamp with time zone'))
        .click(Selector('div.abris-detail-property .abris-property-type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'datetime')
        .click(Selector('.select2-results__option').withText('datetime Date and time'))        
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default div.abris-detail-property div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create'));
    await t
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default').find('div.dt-buttons .btn-default.btn-blue'))
        .typeText(Selector('div.abris-detail-property .abris-property-column_name').find('input'),
            'progress')
        .typeText(Selector('div.abris-detail-property .abris-property-title').find('input'),
            'Progress')
        .click(Selector('div.abris-detail-property .abris-property-data_type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'integer')
        .click(Selector('.select2-results__option').withText('integer'))
        .click(Selector('div.abris-detail-property .abris-property-type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'progress')
        .click(Selector('.select2-results__option').withText('progress Horizontal indicator'))        
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default div.abris-detail-property div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create'));
    await t
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default').find('div.dt-buttons .btn-default.btn-blue'))
        .typeText(Selector('div.abris-detail-property .abris-property-column_name').find('input'),
            'description')
        .typeText(Selector('div.abris-detail-property .abris-property-title').find('input'),
            'Description')
        .click(Selector('div.abris-detail-property .abris-property-data_type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'text')
        .click(Selector('.select2-results__option').withText('text'))
        .click(Selector('div.abris-detail-property .abris-property-type').find('.select2-selection.select2-selection--single'))
        .typeText(Selector('.select2-search__field'), 
            'text')
        .click(Selector('.select2-results__option').withText('text Rich text'))        
        .click(Selector('div.abris-detail-schema abris-panel.relation div.panel.panel-default div.abris-detail-entity div.panel.panel-default div.abris-detail-property div.col-lg-12.actions').find('button.btn.btn-default.btn-green').withText('Create'));
});
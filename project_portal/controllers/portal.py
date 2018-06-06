# Copyright 2017 - 2018 Modoolar <info@modoolar.com>
# License LGPLv3.0 or later (https://www.gnu.org/licenses/lgpl-3.0.en.html).

from collections import OrderedDict
from operator import itemgetter

from odoo import http, _
from odoo.http import request
from odoo.tools import groupby as groupbyelem
from odoo.addons.portal.controllers.portal\
    import get_records_pager, pager as portal_pager

from odoo.addons.project.controllers.portal \
    import CustomerPortal

from odoo.osv.expression import OR


class CustomerPortal(CustomerPortal):

    # ========================
    #   Portal My Projects
    # ========================
    @http.route([
        '/my/projects',
        '/my/projects/page/<int:page>'
    ], type='http', auth="user", website=True)
    def portal_my_projects(self, page=1, date_begin=None, date_end=None,
                           sortby=None, **kw):
        values = self._prepare_portal_layout_values()
        values.update(self.portal_my_projects_prepare_values(
            page, date_begin, date_end, sortby, **kw)
        )
        return self.portal_my_projects_render(values)

    def portal_my_projects_render(self, values):
        return request.render("project.portal_my_projects", values)

    def portal_my_projects_prepare_values(self, page=1, date_begin=None,
                                          date_end=None, sortby=None, **kw):
        Project = request.env['project.project']
        domain = [('privacy_visibility', '=', 'portal')]

        searchbar_sortings = {
            'date': {'label': _('Newest'), 'order': 'create_date desc'},
            'name': {'label': _('Name'), 'order': 'name'},
        }
        if not sortby:
            sortby = 'date'
        order = searchbar_sortings[sortby]['order']

        # archive groups - Default Group By 'create_date'
        archive_groups = self._get_archive_groups('project.project', domain)
        if date_begin and date_end:
            domain += [
                ('create_date', '>', date_begin),
                ('create_date', '<=', date_end)
            ]
        # projects count
        project_count = Project.search_count(domain)
        # pager
        pager = portal_pager(
            url="/my/projects",
            url_args={
                'date_begin': date_begin,
                'date_end': date_end,
                'sortby': sortby,
            },
            total=project_count,
            page=page,
            step=self._items_per_page
        )

        # content according to pager and archive selected
        projects = Project.search(
            domain,
            order=order,
            limit=self._items_per_page,
            offset=pager['offset']
        )
        request.session['my_projects_history'] = projects.ids[:100]

        return {
            'date': date_begin,
            'date_end': date_end,
            'projects': projects,
            'page_name': 'project',
            'archive_groups': archive_groups,
            'default_url': '/my/projects',
            'pager': pager,
            'searchbar_sortings': searchbar_sortings,
            'sortby': sortby
        }

    # ========================
    #   Portal My Project
    # ========================
    @http.route([
        '/my/project/<int:project_id>'
    ], type='http', auth="user", website=True)
    def portal_my_project(self, project_id=None, **kw):
        values = self.portal_my_project_prepare_values(project_id, **kw)
        return self.portal_my_project_render(values)

    def portal_my_project_prepare_values(self, project_id=None, **kw):
        project = request.env['project.project'].browse(project_id)
        vals = {'project': project}
        history = request.session.get('my_projects_history', [])
        vals.update(get_records_pager(history, project))
        return vals

    def portal_my_project_render(self, values):
        return request.render("project.portal_my_project", values)

    # ========================
    #   Portal My Tasks
    # ========================
    @http.route([
        '/my/tasks',
        '/my/tasks/page/<int:page>'
    ], type='http', auth="user", website=True)
    def portal_my_tasks(self, page=1, date_begin=None, date_end=None,
                        sortby=None, filterby=None, search=None,
                        search_in='content', **kw):

        values = self._prepare_portal_layout_values()

        values.update(self.portal_my_tasks_prepare_values(
            page, date_begin, date_end, sortby, filterby,
            search, search_in, **kw)
        )

        return self.portal_my_tasks_render(values)

    def portal_my_tasks_prepare_searchbar(self):
        return {
            'sorting': {
                'date': {
                    'label': _('Newest'),
                    'order': 'create_date desc'
                },
                'name': {
                    'label': _('Title'),
                    'order': 'name'
                },
                'stage': {
                    'label': _('Stage'),
                    'order': 'stage_id'
                },
                'update': {
                    'label': _('Last Stage Update'),
                    'order': 'date_last_stage_update desc'
                },
            },

            'filters': {
                'all': {'label': _('All'), 'domain': []},
            },

            'inputs': {
                'content': {
                    'input': 'content',
                    'label':
                        _('Search <span class="nolabel"> (in Content)</span>')
                },
                'message': {
                    'input': 'message',
                    'label': _('Search in Messages')
                },
                'customer': {
                    'input': 'customer',
                    'label': _('Search in Customer')
                },
                'stage': {
                    'input': 'stage',
                    'label': _('Search in Stages')
                },
                'all': {
                    'input': 'all',
                    'label': _('Search in All')
                },
            },
            'groupby': {
                'none': {
                    'input': 'none',
                    'label': _('None')
                },
                'project': {
                    'input': 'project',
                    'label': _('Project')
                },
            }
        }

    def portal_my_tasks_prepare_task_search_domain(self, search_in, search):
        search_domain = []
        if search and search_in:
            if search_in in ('content', 'all'):
                search_domain = OR([
                    search_domain, [
                        '|',
                        ('name', 'ilike', search),
                        ('description', 'ilike', search)
                    ]
                ])

            if search_in in ('customer', 'all'):
                search_domain = OR([
                    search_domain, [('partner_id', 'ilike', search)]
                ])
            if search_in in ('message', 'all'):
                search_domain = OR([
                    search_domain, [('message_ids.body', 'ilike', search)]
                ])
            if search_in in ('stage', 'all'):
                search_domain = OR([
                    search_domain, [('stage_id', 'ilike', search)]
                ])
        return search_domain

    def portal_my_tasks_prepare_task_search(self, projects, searchbar,
                                            date_begin=None, date_end=None,
                                            sortby=None,
                                            filterby=None, search=None,
                                            search_in='content', **kw):

        # This is a good place to add mandatory criteria

        domain = [('project_id', 'in', projects.ids)]
        # domain = [('project_id.privacy_visibility', '=', 'portal')]

        for proj in projects:
            searchbar['filters'].update({
                str(proj.id): {
                    'label': proj.name,
                    'domain': [('project_id', '=', proj.id)]
                }
            })

        domain += searchbar['filters'][filterby]['domain']

        # archive groups - Default Group By 'create_date'
        archive_groups = self._get_archive_groups('project.task', domain)
        if date_begin and date_end:
            domain += [
                ('create_date', '>', date_begin),
                ('create_date', '<=', date_end)
            ]

        # search
        search_domain = self.portal_my_tasks_prepare_task_search_domain(
            search_in, search
        )
        domain += search_domain

        return {
            'domain': domain,
            'archive_groups': archive_groups,
        }

    def portal_my_tasks_prepare_values(self, page=1, date_begin=None,
                                       date_end=None, sortby=None,
                                       filterby=None,
                                       search=None, search_in='content', **kw):

        groupby = kw.get('groupby', 'project')
        searchbar = self.portal_my_tasks_prepare_searchbar()

        # default sort by value
        if not sortby:
            sortby = 'date'

        order = searchbar['sorting'][sortby]['order']

        # default filter by value
        if not filterby:
            filterby = 'all'

        projects = request.env['project.project'].search([
            ('privacy_visibility', '=', 'portal')
        ])

        search_obj = self.portal_my_tasks_prepare_task_search(
            projects, searchbar, date_begin, date_end, sortby, filterby,
            search, search_in, **kw
        )

        # task count
        task_count = request.env['project.task'].search_count(search_obj['domain'])

        # pager
        pager = portal_pager(
            url="/my/tasks",
            url_args={
                'date_begin': date_begin,
                'date_end': date_end,
                'search': search,
                'sortby': sortby,
                'filterby': filterby
            },
            total=task_count,
            page=page,
            step=self._items_per_page
        )

        # content according to pager and archive selected
        if groupby == 'project':
            order = "project_id, %s" % order  # force sort on project first to group by project in view

        tasks = request.env['project.task'].search(
            search_obj['domain'],
            order=order,
            limit=self._items_per_page,
            offset=pager['offset']
        )
        request.session['my_tasks_history'] = tasks.ids[:100]

        if groupby == 'project':
            grouped_tasks = [
                request.env['project.task'].concat(*g)
                for k, g in groupbyelem(tasks, itemgetter('project_id'))
            ]
        else:
            grouped_tasks = [tasks]

        return {
            'date': date_begin,
            'date_end': date_end,
            'projects': projects,
            'tasks': tasks,
            'grouped_tasks': grouped_tasks,
            'page_name': 'task',
            'archive_groups': search_obj['archive_groups'],
            'default_url': '/my/tasks',
            'pager': pager,
            'searchbar_sortings': searchbar['sorting'],
            'searchbar_groupby': searchbar['groupby'],
            'searchbar_inputs': searchbar['inputs'],
            'search_in': search_in,
            'search': search,
            'sortby': sortby,
            'groupby': groupby,
            'searchbar_filters': OrderedDict(
                sorted(searchbar['filters'].items())
            ),
            'filterby': filterby,
        }

    def portal_my_tasks_render(self, values):
        return request.render("project.portal_my_tasks", values)

    # ========================
    #   Portal My Tasks
    # ========================
    @http.route([
        '/my/task/<int:task_id>'
    ], type='http', auth="user", website=True)
    def portal_my_task(self, task_id=None, **kw):
        values = self.portal_my_task_prepare_values(task_id, **kw)
        return self.portal_my_task_render(values)

    def portal_my_task_prepare_values(self, task_id=None, **kw):
        task = request.env['project.task'].browse(task_id)
        vals = {
            'task': task,
            'user': request.env.user
        }
        history = request.session.get('my_tasks_history', [])
        vals.update(get_records_pager(history, task))
        return vals

    def portal_my_task_render(self, values):
        return request.render("project.portal_my_task", values)

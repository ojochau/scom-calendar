var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("@scom/scom-calendar/interface.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("@scom/scom-calendar/data/holidays.json.ts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    ///<amd-module name='@scom/scom-calendar/data/holidays.json.ts'/> 
    exports.default = [
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-02-12",
            "day": "Monday",
            "name": "Tet holiday",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-02-09",
            "day": "Friday",
            "name": "Vietnamese New Year's Eve",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-02-10",
            "day": "Saturday",
            "name": "Vietnamese New Year",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-04-18",
            "day": "Thursday",
            "name": "Hung Kings Festival",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-01-01",
            "day": "Monday",
            "name": "International New Year's Day",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-05-01",
            "day": "Wednesday",
            "name": "International Labor Day",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-09-02",
            "day": "Monday",
            "name": "Independence Day",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-02-13",
            "day": "Tuesday",
            "name": "Tet holiday",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-04-30",
            "day": "Tuesday",
            "name": "Liberation Day/Reunification Day",
            "type": "NATIONAL_HOLIDAY"
        },
        {
            "country": "Vietnam",
            "iso": "VN",
            "year": 2024,
            "date": "2024-02-11",
            "day": "Sunday",
            "name": "Tet holiday",
            "type": "NATIONAL_HOLIDAY"
        }
    ];
});
define("@scom/scom-calendar/common/select.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.transitionStyle = void 0;
    exports.transitionStyle = components_1.Styles.style({
        $nest: {
            '.scroll-container': {
                // transition: 'transform .3s cubic-bezier(0.19, 1, 0.22, 1) 0s',
                $nest: {
                    '&::-webkit-scrollbar': {
                        height: 0,
                        width: 0
                    },
                }
            }
        }
    });
});
define("@scom/scom-calendar/common/select.tsx", ["require", "exports", "@ijstech/components", "@scom/scom-calendar/common/select.css.ts"], function (require, exports, components_2, select_css_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomCalendarSelect = void 0;
    const Theme = components_2.Styles.Theme.ThemeVars;
    const itemHeight = 50;
    const font = { size: '2rem', weight: 600 };
    const lineHeight = '3.125rem';
    let ScomCalendarSelect = class ScomCalendarSelect extends components_2.Module {
        constructor(parent, options) {
            super(parent, options);
            this.yearMap = new Map();
            this.monthMap = new Map();
            this.dateMap = new Map();
            this.pos1 = { x: 0, y: 0 };
            this.pos2 = { x: 0, y: 0 };
            this.startX = 0;
            this.startY = 0;
            this.yearList = [];
            this.monthList = [];
            this.dateList = [];
            this.newDate = { date: 0, month: 0, year: 0 };
            this.isAnimating = false;
            this.threshold = 10;
            this.isScrolling = false;
            this.onCloseSelect = this.onCloseSelect.bind(this);
            this.onChangedSelect = this.onChangedSelect.bind(this);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get date() {
            return this._data.date;
        }
        set date(value) {
            this._data.date = value;
        }
        get initialData() {
            const month = this.initialDate.getMonth() + 1;
            const year = this.initialDate.getFullYear();
            const date = this.initialDate.getDate();
            const day = this.initialDate.getDay();
            return {
                month,
                year,
                date,
                day
            };
        }
        get daysInMonth() {
            const { month, year } = this.newDate;
            return new Date(year, month, 0).getDate();
        }
        setData(data) {
            this._data = data;
            this.clear();
            this.renderUI();
        }
        clear() {
            this.initialDate = new Date();
            this.newDate = { ...this.initialData };
            this.dateStack.style.transform = '';
            this.yearStack.style.transform = '';
            this.monthStack.style.transform = '';
        }
        renderUI() {
            if (this.date) {
                this.initialDate = new Date(this.date);
                const monthName = this.initialDate.toLocaleString('default', { month: 'short' });
                this.lbDate.caption = `${this.initialDate.getFullYear()} ${monthName}`;
                this.newDate = { ...this.initialData };
            }
            this.initialYear = this.initialDate.getFullYear();
            this.renderCurrent();
        }
        renderDateList() {
            this.dateStack.clearInnerHTML();
            this.dateMap = new Map();
            const { date } = this.initialData;
            this.dateList = [date];
            let prevValue = date;
            let nextValue = date;
            for (let i = 0; i < 5; i++) {
                const newPrev = this.getPrev('date', prevValue);
                prevValue = newPrev;
                this.dateList.unshift(newPrev);
                const newNext = this.getNext('date', nextValue);
                nextValue = newNext;
                this.dateList.push(newNext);
            }
            for (let i of this.dateList) {
                const lb = this.$render("i-label", { stack: { grow: '0' }, caption: `${i}`, font: font, opacity: i === date ? 1 : 0.5, lineHeight: lineHeight });
                lb.setAttribute('data-date', `${i}`);
                this.dateStack.appendChild(lb);
                this.dateMap.set(i, lb);
            }
            this._translate(0, -4 * itemHeight, this.dateStack);
        }
        renderMonthList() {
            this.monthStack.clearInnerHTML();
            this.monthMap = new Map();
            const { month } = this.initialData;
            let prevValue = month;
            let nextValue = month;
            this.monthList = [month];
            for (let i = 0; i < 5; i++) {
                const newPrev = this.getPrev('month', prevValue);
                prevValue = newPrev;
                this.monthList.unshift(newPrev);
                const newNext = this.getNext('month', nextValue);
                nextValue = newNext;
                this.monthList.push(newNext);
            }
            for (let i of this.monthList) {
                const lb = this.$render("i-label", { stack: { grow: '0' }, caption: `${i}`, font: font, opacity: i === month ? 1 : 0.5, lineHeight: lineHeight });
                lb.setAttribute('data-month', `${i}`);
                this.monthStack.appendChild(lb);
                this.monthMap.set(i, lb);
            }
            this._translate(0, -4 * itemHeight, this.monthStack);
        }
        renderYearList() {
            this.yearStack.clearInnerHTML();
            this.yearMap = new Map();
            const { year } = this.initialData;
            this.yearList = [year];
            let prevValue = year;
            let nextValue = year;
            for (let i = 0; i < 5; i++) {
                const newPrev = this.getPrev('year', prevValue);
                prevValue = newPrev;
                this.yearList.unshift(newPrev);
                const newNext = this.getNext('year', nextValue);
                nextValue = newNext;
                this.yearList.push(newNext);
            }
            for (let i of this.yearList) {
                const lb = this.$render("i-label", { stack: { grow: '0' }, caption: `${i}`, font: font, opacity: i === year ? 1 : 0.5, lineHeight: lineHeight });
                lb.setAttribute('data-year', `${i}`);
                this.yearStack.appendChild(lb);
                this.yearMap.set(i, lb);
            }
            this._translate(0, -4 * itemHeight, this.yearStack);
        }
        getPrev(type, value) {
            let result = 0;
            if (type === 'date') {
                result = value === 1 ? this.daysInMonth : value - 1;
            }
            else if (type === 'month') {
                result = value === 1 ? 12 : value - 1;
            }
            else {
                if (value > this.initialYear - 20)
                    result = value - 1;
            }
            return result;
        }
        getNext(type, value) {
            let result = 0;
            if (type === 'date') {
                result = value === this.daysInMonth ? 1 : value + 1;
            }
            else if (type === 'month') {
                result = value === 12 ? 1 : value + 1;
            }
            else {
                if (value < this.initialYear + 20)
                    result = value + 1;
            }
            return result;
        }
        renderCurrent() {
            this.renderDateList();
            this.renderMonthList();
            this.renderYearList();
        }
        onCloseSelect() {
            if (this.onClose)
                this.onClose();
        }
        onChangedSelect() {
            const { year, month, date } = this.newDate;
            const newDate = new Date(year, month - 1, date);
            if (this.onChanged)
                this.onChanged(newDate.toISOString());
        }
        dragStartHandler(event) {
            if (event instanceof TouchEvent) {
                this.pos1 = {
                    x: event.touches[0].pageX,
                    y: event.touches[0].pageY
                };
            }
            else {
                event.preventDefault();
                this.pos1 = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
            this.pos2 = { x: 0, y: 0 };
            this.startY = this.pos1.y;
            this.isScrolling = true;
        }
        dragHandler(event) {
            let deltaY = 0;
            if (event instanceof TouchEvent) {
                this.pos2 = {
                    x: this.pos1.x - event.touches[0].pageX,
                    y: this.pos1.y - event.touches[0].pageY
                };
                deltaY = event.touches[0].pageY - this.startY;
                this.startY = event.touches[0].pageY;
                this.startX = event.touches[0].pageX;
            }
            else {
                this.pos2 = {
                    x: this.pos1.x - event.clientX,
                    y: this.pos1.y - event.clientY,
                };
                deltaY = event.clientY - this.startY;
                this.startY = event.clientY;
                this.startX = event.clientX;
            }
            const scroller = this.findNearestChild(this.startX, this.startY);
            const parentStack = scroller ? scroller.children[0] : null;
            if (parentStack) {
                const type = this.getParentType(parentStack);
                const distance = Math.abs(deltaY / itemHeight);
                if (distance > 1)
                    this.updateList(type, deltaY > 0 ? 1 : -1, distance);
                const { x, y } = this.getTransform(parentStack);
                this._translate(x, y + deltaY, parentStack);
            }
            else {
                event.preventDefault();
                return false;
            }
        }
        findNearestChild(x, y) {
            for (let child of this.pnlSelect.children) {
                const c = child;
                const { left, top } = child.getBoundingClientRect();
                if (x >= left && x <= left + c.offsetWidth && y >= top && y <= top + c.offsetHeight) {
                    return child;
                }
            }
            return null;
        }
        dragEndHandler(event) {
            this.isScrolling = false;
            let clientX = 0;
            let clientY = 0;
            if (event instanceof TouchEvent) {
                clientY = event.touches[0].pageY;
                clientX = event.touches[0].pageX;
            }
            else {
                clientY = event.clientY;
                clientX = event.clientX;
            }
            const scroller = this.findNearestChild(clientX, clientY);
            const parentStack = scroller ? scroller.children[0] : null;
            const type = this.getParentType(parentStack);
            if (type) {
                if (this.pos2.y < -this.threshold) {
                    this.onScroll(type, -1);
                }
                else if (this.pos2.y > this.threshold) {
                    this.onScroll(type, 1);
                }
                else {
                    this.onRefresh(type);
                }
            }
            else {
                this.onRefresh('date');
                this.onRefresh('month');
                this.onRefresh('year');
            }
        }
        getParentType(parentStack) {
            let type;
            switch (parentStack?.id) {
                case 'dateStack':
                    type = 'date';
                    break;
                case 'monthStack':
                    type = 'month';
                    break;
                case 'yearStack':
                    type = 'year';
                    break;
            }
            return type;
        }
        onScroll(type, direction) {
            const mapEl = this[`${type}Map`];
            const parentStack = this[`${type}Stack`];
            const distance = Math.round(Math.abs(this.pos2.y) / itemHeight);
            const oldEl = mapEl.get(this.newDate[type]);
            if (oldEl)
                oldEl.opacity = 0.5;
            this.updateList(type, direction, distance);
            let newValue = 0;
            if (type === 'month') {
                this.initialDate.setMonth(this.initialDate.getMonth() + (distance * direction));
                newValue = this.initialDate.getMonth() + 1;
            }
            else if (type === 'year') {
                this.initialDate.setFullYear(this.initialDate.getFullYear() + (distance * direction));
                newValue = this.initialDate.getFullYear();
            }
            else {
                this.initialDate.setDate(this.initialDate.getDate() + (distance * direction));
                newValue = this.initialDate.getDate();
            }
            this.newDate[type] = newValue;
            const newEl = mapEl.get(newValue);
            if (newEl)
                newEl.opacity = 1;
            const index = Array.from(parentStack.children).findIndex(child => child.dataset[type] === `${newValue}`);
            if (index > 0) {
                const y = (index - 1) * itemHeight;
                if (distance < 2) {
                    this._translate(0, -y, parentStack);
                }
                else {
                    this.animateFn(0, y, 300, parentStack);
                }
            }
            if (type === 'month')
                this.renderDateList();
        }
        onRefresh(type) {
            const parentStack = this[`${type}Stack`];
            const index = Array.from(parentStack.children).findIndex(child => child.dataset[type] === `${this.newDate[type]}`);
            if (index > 0) {
                const y = (index - 1) * itemHeight;
                this._translate(0, -y, parentStack);
            }
            else
                this._translate(0, 0, parentStack);
        }
        _translate(x, y, parentStack) {
            parentStack.style.transform = `translate3d(0px, ${y}px, 0)`;
            parentStack.style.transform = `translate(0px, ${y}px)`;
        }
        animateFn(destX, destY, duration, parentStack) {
            let that = this;
            let startX = this.pos1.x;
            let startY = this.pos1.y;
            let startTime = Date.now();
            let destTime = startTime + duration;
            function easeInOutQuad(t) {
                return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            }
            function step() {
                let now = Date.now();
                let newX;
                let newY;
                let easedTime;
                if (now >= destTime) {
                    that.isAnimating = false;
                    that._translate(destX, -destY, parentStack);
                    return;
                }
                now = (now - startTime) / duration;
                easedTime = easeInOutQuad(now);
                newX = (destX - startX) * easedTime + startX;
                newY = (destY - startY) * easedTime + startY;
                that._translate(newX, -newY, parentStack);
                if (that.isAnimating) {
                    window.requestAnimationFrame(step);
                }
            }
            this.isAnimating = true;
            step();
        }
        updateList(type, direction, distance) {
            const mapEl = this[`${type}Map`];
            const parentStack = this[`${type}Stack`];
            const getLabel = (value) => {
                const lb = mapEl.get(value) || this.$render("i-label", { caption: `${value}`, font: font, lineHeight: lineHeight, opacity: 0.5 });
                lb.setAttribute(`data-${type}`, `${value}`);
                return lb;
            };
            if (direction === -1) {
                let prevValue = +parentStack.firstChild.dataset[type];
                for (let i = 0; i < distance; i++) {
                    const newPrev = this.getPrev(type, prevValue);
                    if (!newPrev)
                        break;
                    prevValue = newPrev;
                    const prevLb = getLabel(newPrev);
                    parentStack.append(prevLb);
                    parentStack.insertBefore(prevLb, parentStack.firstChild);
                    mapEl.set(newPrev, prevLb);
                }
            }
            else if (direction === 1) {
                let nextValue = +parentStack.lastChild.dataset[type];
                for (let i = 0; i < distance; i++) {
                    const newNext = this.getNext(type, nextValue);
                    if (!newNext)
                        break;
                    nextValue = newNext;
                    const lb = getLabel(newNext);
                    lb.setAttribute(`data-${type}`, `${newNext}`);
                    parentStack.append(lb);
                    mapEl.set(newNext, lb);
                }
            }
        }
        getTransform(parent) {
            let matrix = getComputedStyle(parent, null)['transform'].replace(/[^0-9-.,]/g, '').split(',');
            return {
                x: Number(matrix[4] || 0),
                y: Number(matrix[5] || 0)
            };
        }
        _handleMouseDown(event, stopPropagation) {
            const target = event.target;
            const wrapper = target.closest('.scroller');
            if (wrapper) {
                this.dragStartHandler(event);
                return true;
            }
            return super._handleMouseDown(event, stopPropagation);
        }
        _handleMouseMove(event, stopPropagation) {
            const target = event.target;
            const wrapper = target.closest('#pnlSelect');
            if (wrapper) {
                this.dragHandler(event);
                return true;
            }
            return super._handleMouseMove(event, stopPropagation);
        }
        _handleMouseUp(event, stopPropagation) {
            const target = event.target;
            const wrapper = target.closest('#pnlSelect');
            if (wrapper) {
                this.dragEndHandler(event);
                return true;
            }
            else {
                this.onRefresh('date');
                this.onRefresh('month');
                this.onRefresh('year');
            }
            return super._handleMouseUp(event, stopPropagation);
        }
        init() {
            super.init();
            this.onChanged = this.getAttribute('onChanged', true) || this.onChanged;
            this.onClose = this.getAttribute('onClose', true) || this.onClose;
            const date = this.getAttribute('date', true);
            if (date)
                this.setData({ date });
        }
        render() {
            return (this.$render("i-panel", { padding: { top: '2rem', bottom: '2rem', left: '2rem', right: '2rem' }, class: select_css_1.transitionStyle },
                this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: '0.5rem' },
                    this.$render("i-hstack", { gap: "1rem", horizontalAlignment: 'center' },
                        this.$render("i-label", { id: "lbDate", caption: '' }),
                        this.$render("i-icon", { name: "caret-up", width: '1rem', height: '1rem', fill: Theme.text.primary }))),
                this.$render("i-vstack", { verticalAlignment: 'center', horizontalAlignment: 'center', gap: "1rem", minHeight: '50vh', position: 'relative' },
                    this.$render("i-grid-layout", { id: "pnlSelect", columnsPerRow: 3, horizontalAlignment: 'center', gap: { column: '1rem', row: '0.25rem' } },
                        this.$render("i-panel", { overflow: 'hidden', height: '9.375rem', width: '100%', class: "scroller" },
                            this.$render("i-vstack", { id: "dateStack", verticalAlignment: 'start', horizontalAlignment: 'center', position: 'relative', 
                                // overflow={{x: 'hidden', y: 'auto'}}
                                width: '100%', height: '100%', cursor: 'pointer', class: "scroll-container date-container" })),
                        this.$render("i-panel", { overflow: 'hidden', height: '9.375rem', width: '100%', class: "scroller" },
                            this.$render("i-vstack", { id: "monthStack", verticalAlignment: 'start', horizontalAlignment: 'center', position: 'relative', 
                                // overflow={{x: 'hidden', y: 'auto'}}
                                width: '100%', height: '100%', cursor: 'pointer', class: "scroll-container month-container" })),
                        this.$render("i-panel", { overflow: 'hidden', height: '9.375rem', width: '100%', class: "scroller" },
                            this.$render("i-vstack", { id: "yearStack", verticalAlignment: 'start', horizontalAlignment: 'center', position: 'relative', 
                                // overflow={{x: 'hidden', y: 'auto'}}
                                width: '100%', height: '100%', cursor: 'pointer', class: "scroll-container year-container" })))),
                this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between' },
                    this.$render("i-button", { caption: 'Cancel', font: { weight: 600, size: '1rem', color: Theme.text.primary }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, stack: { basis: '50%' }, background: { color: 'transparent' }, boxShadow: 'none', border: { radius: 0 }, onClick: this.onCloseSelect }),
                    this.$render("i-button", { caption: 'Ok', font: { weight: 600, size: '1rem', color: Theme.text.primary }, padding: { top: '0.5rem', bottom: '0.5rem', left: '1rem', right: '1rem' }, stack: { basis: '50%' }, background: { color: 'transparent' }, border: { radius: 0 }, boxShadow: 'none', onClick: this.onChangedSelect }))));
        }
    };
    ScomCalendarSelect = __decorate([
        components_2.customModule,
        (0, components_2.customElements)('i-scom-calendar--select')
    ], ScomCalendarSelect);
    exports.ScomCalendarSelect = ScomCalendarSelect;
});
define("@scom/scom-calendar/common/index.ts", ["require", "exports", "@scom/scom-calendar/common/select.tsx"], function (require, exports, select_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ScomCalendarSelect = void 0;
    Object.defineProperty(exports, "ScomCalendarSelect", { enumerable: true, get: function () { return select_1.ScomCalendarSelect; } });
});
define("@scom/scom-calendar/index.css.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.swipeStyle = exports.transitionStyle = void 0;
    const Theme = components_3.Styles.Theme.ThemeVars;
    exports.transitionStyle = components_3.Styles.style({
        transition: 'height 0.3s ease'
    });
    exports.swipeStyle = components_3.Styles.style({
        // scrollSnapType: 'x mandatory',
        // "-webkit-scroll-snap-type": 'x mandatory',
        // '-webkit-overflow-scrolling': 'unset',
        // transition: 'transform 0.3s ease',
        $nest: {
            '.scroll-item': {
                scrollSnapAlign: 'start'
            },
            '&::-webkit-scrollbar': {
                height: 0
            },
        }
    });
});
define("@scom/scom-calendar/assets.ts", ["require", "exports", "@ijstech/components"], function (require, exports, components_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const moduleDir = components_4.application.currentModuleDir;
    function fullPath(path) {
        return `${moduleDir}/${path}`;
    }
    ;
    exports.default = {
        fullPath
    };
});
define("@scom/scom-calendar", ["require", "exports", "@ijstech/components", "@scom/scom-calendar/data/holidays.json.ts", "@scom/scom-calendar/common/index.ts", "@scom/scom-calendar/index.css.ts", "@scom/scom-calendar/assets.ts", "@scom/scom-calendar/index.css.ts"], function (require, exports, components_5, holidays_json_1, index_1, index_css_1, assets_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Theme = components_5.Styles.Theme.ThemeVars;
    const DATES_PER_SLIDE = 35;
    const DAYS = 7;
    const ROWS = 5;
    const defaultHolidayColor = Theme.colors.info.main;
    const defaultEventColor = Theme.colors.primary.main;
    const currentColor = Theme.colors.secondary.main;
    let ScomCalendar = class ScomCalendar extends components_5.Module {
        constructor(parent, options) {
            super(parent, options);
            this.datesMap = new Map();
            this.monthsMap = new Map();
            this.selectedMap = new Map();
            this.initialDate = new Date();
            this.currentDate = new Date();
            this.filteredData = {};
            this.pos1 = { x: 0, y: 0 };
            this.pos2 = { x: 0, y: 0 };
            this.oldMonth = '';
            this.datePnlHeight = 0;
            this.isVerticalSwiping = false;
            this.isHorizontalSwiping = false;
            this.viewMode = 'month';
            this.isInitialWeek = false;
            this.initalDay = 0;
            this._events = [];
            this.onFilterData = this.onFilterData.bind(this);
        }
        static async create(options, parent) {
            let self = new this(parent, options);
            await self.ready();
            return self;
        }
        get events() {
            return this._events ?? [];
        }
        set events(value) {
            this._events = value ?? [];
        }
        isCurrentDate(date) {
            if (!date)
                return false;
            return this.currentDate.getDate() === date.date &&
                this.currentDate.getMonth() + 1 === date.month &&
                this.currentDate.getFullYear() === date.year;
        }
        get initialData() {
            const month = this.initialDate.getMonth() + 1;
            const year = this.initialDate.getFullYear();
            const date = this.initialDate.getDate();
            const day = this.initialDate.getDay();
            return {
                month,
                year,
                date,
                day
            };
        }
        get monthKey() {
            return `${this.initialData.month}-${this.initialData.year}`;
        }
        get datesInMonth() {
            const { month, year } = this.initialData;
            let dates = [];
            if (this.datesMap.has(this.monthKey)) {
                dates = this.datesMap.get(this.monthKey);
            }
            else {
                dates = this.getDates(month, year);
            }
            return dates;
        }
        get calendarData() {
            const eventsMap = new Map();
            for (let i = 0; i < this.datesInMonth.length; i++) {
                const item = this.datesInMonth[i];
                const holiday = this.getHoliday(item);
                const events = this.getEvents(item);
                const dateKey = `${item.date}-${item.month}-${item.year}`;
                eventsMap.set(dateKey, { holiday, events });
            }
            return eventsMap;
        }
        get isWeekMode() {
            return this.viewMode === 'week';
        }
        getDates(month, year) {
            let dates = [];
            const firstDay = new Date(year, month - 1, 1).getDay();
            const daysInMonth = this.daysInMonth(month, year);
            const prevMonthLastDate = new Date(year, month - 1, 0);
            const prevMonth = prevMonthLastDate.getMonth() + 1;
            const prevYear = prevMonthLastDate.getFullYear();
            const prevDate = prevMonthLastDate.getDate();
            const prevDateStr = `${prevMonth}/${prevDate}/${prevYear}`;
            if (firstDay > 0) {
                dates.unshift({ month: prevMonth, year: prevYear, date: prevDate, day: prevMonthLastDate.getDay() });
                for (let i = 1; i < firstDay; i++) {
                    const before = (0, components_5.moment)(prevDateStr).subtract(i, 'days');
                    dates.unshift({ month: prevMonth, year: prevYear, date: before.get('date'), day: before.get('day') });
                }
            }
            for (let i = 1; i <= daysInMonth; i++) {
                const date = new Date(year, month - 1, i);
                dates.push({ month, year, date: i, day: date.getDay() });
            }
            const fillingDates = DATES_PER_SLIDE - dates.length;
            if (fillingDates > 0) {
                for (let i = 1; i <= fillingDates; i++) {
                    const after = (0, components_5.moment)(`${month}/${daysInMonth}-${year}`).add(i, 'days');
                    dates.push({ month: month + 1, year: year, date: after.get('date'), day: after.get('day') });
                }
            }
            return dates;
        }
        daysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        }
        getEvents(item) {
            const { year, month, date } = item;
            return [...this.events].filter(event => {
                const startDate = (0, components_5.moment)(event.startDate).startOf('day');
                const endDate = (0, components_5.moment)(event.endDate).endOf('day');
                const checkingDate = (0, components_5.moment)(`${month}/${date}/${year}`).startOf('day');
                return startDate.isSameOrBefore(checkingDate) && checkingDate.isSameOrBefore(endDate);
            });
        }
        getHoliday(item) {
            const { year, month, date } = item;
            const finded = holidays_json_1.default.find(holiday => {
                return (0, components_5.moment)(holiday.date).isSame((0, components_5.moment)(`${month}/${date}/${year}`));
            });
            return finded;
        }
        setData({ events }) {
            this.initialDate = new Date();
            this.clear();
            this.events = events;
            this.renderUI();
        }
        renderUI(direction) {
            const { month, year } = this.initialData;
            const date = this.initialDate.getDate();
            const monthName = this.initialDate.toLocaleString('default', { month: 'short' });
            this.inputAdd.placeholder = `Add event on ${monthName} ${date}`;
            this.renderMonth(month, year, direction);
            this.renderEventSlider();
        }
        clear() {
            this.listStack.clearInnerHTML();
            this.updateDatesHeight('100%');
            this.viewMode = 'month';
            this.pnlSelected.height = 0;
            this.monthsMap = new Map();
            this.selectedMap = new Map();
            this.initalDay = this.initialDate.getDay();
            this.currentDate = new Date();
            this.filteredData = {};
            this.isInitialWeek = false;
            this.style.setProperty('--grow', this.isWeekMode ? '1' : '0');
            this.style.setProperty('--inner-grow', this.isWeekMode ? '0' : '1');
        }
        renderHeader() {
            this.gridHeader.clearInnerHTML();
            const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
            for (let i = 0; i < days.length; i++) {
                const color = i === 0 ? Theme.colors.error.main : Theme.text.primary;
                const el = this.$render("i-label", { caption: days[i], font: { size: '1rem', weight: 500, color }, opacity: 0.7, padding: { top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }, lineHeight: '1.5rem', class: "text-center" });
                this.gridHeader.append(el);
            }
        }
        renderMonth(month, year, direction) {
            this.lbMonth.caption = (0, components_5.moment)(this.initialDate).format('MMM');
            this.lbYear.caption = (0, components_5.moment)(this.initialDate).format('YYYY');
            this.lbYear.visible = this.initialDate.getFullYear() !== this.currentDate.getFullYear();
            const gridMonth = this.monthsMap.get(this.monthKey);
            if (gridMonth) {
                this.updateMonthUI(gridMonth);
                return;
            }
            const gridDates = this.$render("i-stack", { direction: this.isWeekMode ? 'horizontal' : 'vertical', width: '100%', stack: { shrink: '0', grow: 'var(--grow, 0)', basis: '100%' }, overflow: { x: 'auto', y: 'hidden' }, class: `${index_css_1.swipeStyle} scroll-item`, position: 'relative' });
            gridDates.setAttribute('data-month', this.monthKey);
            for (let i = 0; i < ROWS; i++) {
                gridDates.append(this.$render("i-grid-layout", { border: { top: { width: '1px', style: 'solid', color: Theme.divider } }, width: '100%', class: "scroll-item", templateRows: ['1fr'], templateColumns: [`repeat(${DAYS}, 1fr)`], gap: { column: '0.25rem' }, stack: { shrink: 'var(--inner-grow, 1)', grow: 'var(--inner-grow, 1)', basis: '100%' }, autoRowSize: 'auto', autoFillInHoles: true, position: 'relative' }));
            }
            const dates = [...this.datesInMonth];
            for (let i = 0; i < dates.length; i++) {
                const rowIndex = Math.floor(i / DAYS);
                if (!gridDates.children[rowIndex])
                    break;
                const columnIndex = i % DAYS;
                const item = dates[i];
                const inMonth = this.initialDate.getMonth() + 1 === item.month && this.initialDate.getFullYear() === item.year;
                const defaultColor = i === rowIndex * DAYS ? Theme.colors.error.main : Theme.text.primary;
                const color = this.isCurrentDate(item) ? Theme.colors.primary.contrastText : defaultColor;
                const bgColor = this.isCurrentDate(item) ? currentColor : 'transparent';
                const { holiday, events } = this.calendarData.get(`${item.date}-${item.month}-${item.year}`);
                const isSelectedDate = this.initialDate.getDate() === item.date;
                const borderColor = isSelectedDate ? Theme.colors.primary.main : Theme.background.main;
                const el = (this.$render("i-vstack", { gap: "0.125rem", margin: { top: '0.125rem', bottom: '0.125rem' }, padding: { top: '0.125rem', bottom: '0.125rem', left: '0.125rem', right: '0.125rem' }, border: { radius: '0.25rem', width: '1px', style: 'solid', color: borderColor }, cursor: 'pointer', overflow: 'hidden', onClick: (target, event) => this.onDateClick(target, event, item) },
                    this.$render("i-label", { caption: `${item.date}`, font: { size: '1rem', weight: 500, color }, opacity: inMonth ? 1 : 0.36, padding: { top: '0.25rem', bottom: '0.25rem', left: '0.25rem', right: '0.25rem' }, border: { radius: '0.125rem' }, background: { color: bgColor }, class: "text-center" })));
                el.setAttribute('data-date', `${item.date}-${item.month}-${item.year}`);
                el.setAttribute('data-week', `${rowIndex}`);
                if (holiday) {
                    const holidayEl = this.renderHoliday(holiday, columnIndex);
                    el.append(holidayEl);
                }
                if (events?.length) {
                    for (let event of events) {
                        const eventEl = this.renderEvent(event, columnIndex);
                        el.append(eventEl);
                    }
                }
                gridDates.children[rowIndex].append(el);
                if (isSelectedDate) {
                    this.updateOldDate();
                    this.selectedDate = el;
                }
            }
            const oldMonth = this.monthsMap.get(this.oldMonth);
            this.listStack.append(gridDates);
            if (oldMonth && direction) {
                if (direction === 1) {
                    this.listStack.insertBefore(oldMonth, gridDates);
                }
                else {
                    this.listStack.insertBefore(gridDates, oldMonth);
                }
            }
            this.datesMap.set(`${month}-${year}`, dates);
            this.monthsMap.set(`${month}-${year}`, gridDates);
            this.selectedMonth = gridDates;
        }
        renderEvent(event, columnIndex) {
            // const spanDays = moment(event.endDate).startOf('day').diff(moment(event.startDate).startOf('day'), 'days');
            // const columnSpan = spanDays === 0 ? 1 : spanDays;
            const eventEl = (this.$render("i-vstack", { grid: { column: columnIndex + 1, columnSpan: 1, verticalAlignment: 'start' }, border: { radius: '0.25rem' }, background: { color: event.color || defaultEventColor }, minHeight: 3, maxHeight: '100%', height: 'var(--event-height, auto)', padding: { left: '0.125rem', right: '0.125rem', top: '0.125rem', bottom: '0.125rem' }, overflow: 'hidden', cursor: 'pointer' },
                this.$render("i-label", { caption: event.title, opacity: 'var(--event-opacity, 1)', lineHeight: '1rem', font: { size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500 }, textOverflow: 'ellipsis' })));
            return eventEl;
        }
        renderHoliday(holiday, columnIndex) {
            return this.$render("i-vstack", { border: { radius: '0.25rem' }, background: { color: defaultHolidayColor }, grid: { column: columnIndex + 1, verticalAlignment: 'start' }, padding: { left: '0.125rem', right: '0.125rem', top: '0.125rem', bottom: '0.125rem' }, minHeight: 3, maxHeight: '100%', height: 'var(--event-height, auto)', overflow: 'hidden', cursor: 'pointer' },
                this.$render("i-label", { caption: holiday.name, opacity: 'var(--event-opacity, 1)', lineHeight: '1rem', wordBreak: 'break-word', lineClamp: 2, font: { size: '0.75rem', color: Theme.colors.primary.contrastText, weight: 500 } }));
        }
        renderEventSlider() {
            const calendarData = this.calendarData;
            const itemsData = [];
            let activeIndex = 0;
            const currentDate = this.initialDate.getDate();
            const currentMonth = this.initialDate.getMonth() + 1;
            for (let i = 0; i < this.datesInMonth.length; i++) {
                const date = this.datesInMonth[i];
                const { holiday, events } = calendarData.get(`${date.date}-${date.month}-${date.year}`);
                const eventEl = this.renderSliderItem(date, holiday, events);
                itemsData.push({
                    name: '',
                    controls: [eventEl]
                });
                if (currentDate === date.date && currentMonth === date.month) {
                    activeIndex = i;
                }
            }
            this.eventSlider.items = itemsData;
            this.eventSlider.activeSlide = activeIndex;
        }
        renderSliderItem(item, holiday, events) {
            const { date, month, year } = item;
            const dateKey = `${date}-${month}-${year}`;
            const monthName = new Date(year, month - 1, date).toLocaleString('default', { month: 'short' });
            const selectedPanel = this.selectedMap.get(dateKey);
            if (selectedPanel)
                return;
            const selectedWrap = this.$render("i-vstack", { width: '100%', padding: { top: '0.5rem', bottom: '0.5rem', left: '0.75rem', right: '0.75rem' } });
            selectedWrap.setAttribute('data-slider-date', dateKey);
            const caption = `${date} ${monthName}`;
            selectedWrap.append(this.$render("i-hstack", { gap: '0.5rem', verticalAlignment: 'center', horizontalAlignment: 'space-between', margin: { top: '1rem' }, width: '100%', overflow: 'hidden' },
                this.$render("i-hstack", { gap: '0.5rem', verticalAlignment: 'center', horizontalAlignment: 'space-between' },
                    this.$render("i-label", { caption: caption, font: { size: '0.75rem', weight: 600 } })),
                this.$render("i-icon", { stack: { shrink: '0' }, width: '0.75rem', height: '0.75rem', fill: Theme.text.primary, name: 'smile' })));
            const eventsStack = this.$render("i-vstack", { width: "100%", gap: "1rem", margin: { top: '0.5rem' } });
            selectedWrap.append(eventsStack);
            if (!holiday && !events.length) {
                eventsStack.append(this.$render("i-label", { margin: { top: '0.5rem' }, caption: 'No events', font: { size: '0.75rem', color: Theme.text.primary } }));
            }
            else {
                this.renderSelectedHoliday(holiday, eventsStack);
                for (let i = 0; i < events.length; i++) {
                    this.renderSelectedEvent(events[i], eventsStack, i === events.length - 1);
                }
            }
            return selectedWrap;
        }
        handleEventClick(data, event) {
            if (this.onItemClicked)
                this.onItemClicked(data, event);
        }
        renderSelectedEvent(event, parent, isLast) {
            const startTime = (0, components_5.moment)(event.startDate).format('HH:mm');
            const endTime = (0, components_5.moment)(event.endDate).format('HH:mm');
            let iconAttr = {};
            if (event.link?.startsWith('https://meet.google.com/')) {
                iconAttr = { image: { url: assets_1.default.fullPath('img/google-drive.png'), width: '1rem', height: '1rem', display: 'inline-block' } };
            }
            else {
                iconAttr = { width: '1rem', height: '1rem', name: 'globe' };
            }
            parent.appendChild(this.$render("i-panel", { border: { bottom: { width: '1px', style: isLast ? 'none' : 'solid', color: Theme.divider } }, cursor: 'pointer', onClick: (t, e) => this.handleEventClick(event, e) },
                this.$render("i-hstack", { padding: { top: '0.75rem', bottom: '0.75rem', left: '0.5rem', right: '0.5rem' }, gap: '0.25rem', horizontalAlignment: 'space-between' },
                    this.$render("i-hstack", { gap: '0.25rem', stack: { grow: '1' } },
                        this.$render("i-hstack", { stack: { shrink: '0', basis: '2.5rem' } },
                            this.$render("i-label", { caption: startTime, font: { size: '0.75rem', weight: 500 } })),
                        this.$render("i-panel", { stack: { shrink: '0', basis: '3px' }, height: '1.25rem', width: 3, border: { radius: '0.25rem' }, margin: { right: '0.625rem' }, background: { color: event.color || defaultEventColor } }),
                        this.$render("i-vstack", { gap: "0.25rem" },
                            this.$render("i-label", { caption: event.title, font: { size: '1rem', weight: 500 } }),
                            this.$render("i-label", { caption: `${startTime} - ${endTime}`, font: { size: '0.75rem', weight: 500 }, opacity: 0.36 }))),
                    this.$render("i-icon", { cursor: 'pointer', stack: { shrink: '0' }, onClick: () => window.open(event.link, '_blank'), visible: !!event.link, ...iconAttr }))));
        }
        renderSelectedHoliday(holiday, parent) {
            if (!holiday)
                return;
            parent.appendChild(this.$render("i-panel", null,
                this.$render("i-hstack", { padding: { top: '0.75rem', bottom: '0.75rem', left: '0.5rem', right: '0.5rem' }, gap: '0.25rem' },
                    this.$render("i-hstack", { stack: { shrink: '0', basis: '2.5rem' }, horizontalAlignment: 'center' },
                        this.$render("i-icon", { width: '0.75rem', height: '0.75rem', fill: Theme.text.primary, name: 'calendar' })),
                    this.$render("i-panel", { stack: { shrink: '0', basis: '3px' }, height: '1.25rem', width: 3, border: { radius: '0.25rem' }, margin: { right: '0.625rem' }, background: { color: holiday?.color || defaultHolidayColor } }),
                    this.$render("i-label", { caption: holiday.name, font: { size: '1rem', weight: 500 } }),
                    this.$render("i-vstack", { verticalAlignment: 'center', margin: { left: 'auto' }, stack: { shrink: '0' } },
                        this.$render("i-icon", { width: '0.75rem', height: '0.75rem', fill: Theme.text.primary, name: 'calendar-week' })))));
        }
        onDateClick(target, event, date) {
            event.preventDefault();
            event.stopPropagation();
            if (this.isVerticalSwiping || this.isHorizontalSwiping)
                return;
            this.updateOldDate();
            this.initialDate = new Date(date.year, date.month - 1, date.date);
            this.initalDay = this.initialDate.getDay();
            this.updateNewDate(target, date);
            if (this.viewMode === 'month') {
                this.updateDatesHeight('40%');
                this.pnlSelected.height = 'auto';
            }
            const { month, year } = this.currentMonth || this.initialData;
            const index = this.datesMap.get(`${month}-${year}`).findIndex(d => d.date === date.date && d.month === date.month);
            this.eventSlider.activeSlide = index;
            this.filteredData.date = date;
            if (this.onFilter)
                this.onFilter({ date });
        }
        updateOldDate() {
            if (this.selectedDate) {
                this.selectedDate.border.color = Theme.background.main;
            }
        }
        updateNewDate(target, data) {
            const { month, year, date } = data;
            const monthName = new Date(year, month - 1, date).toLocaleString('default', { month: 'short' });
            this.inputAdd.placeholder = `Add event on ${monthName} ${date}`;
            if (target) {
                this.selectedDate = target;
                target.border = { radius: '0.25rem', width: '1px', style: 'solid', color: `${Theme.colors.primary.main}!important` };
            }
        }
        updateDatesHeight(height) {
            this.pnlDates.height = height;
            let opacity = height === '40%' || height === '15%' ? '0' : '1';
            this.style.setProperty('--event-opacity', opacity);
            this.style.setProperty('--event-height', opacity === '0' ? '3px' : 'auto');
        }
        onMonthChanged(direction) {
            this.oldMonth = `${this.initialDate.getMonth() + 1}-${this.initialDate.getFullYear()}`;
            this.initialDate.setMonth(this.initialDate.getMonth() + direction);
            this.currentMonth = { month: this.initialDate.getMonth() + 1, year: this.initialDate.getFullYear() };
            this.renderUI(direction);
        }
        onFilterData(target) {
            this.filteredData.type = target.caption;
            if (this.onFilter)
                this.onFilter({ type: target.caption });
        }
        onSlideChanged(index) {
            const { month, year } = this.initialData;
            const dates = this.datesMap.get(`${month}-${year}`);
            const newDate = dates[index];
            this.onSelectedDateChanged(newDate);
        }
        onSelectedDateChanged(data) {
            this.updateOldDate();
            const { date, month, year } = data;
            this.initialDate = new Date(year, month - 1, date);
            this.initalDay = this.initialDate.getDay();
            const dataDate = `${date}-${month}-${year}`;
            const target = this.listStack.querySelector(`[data-date="${dataDate}"]`);
            this.updateNewDate(target, data);
        }
        _handleMouseDown(event, stopPropagation) {
            const result = super._handleMouseDown(event, stopPropagation);
            if (result !== undefined) {
                const target = event.target;
                const sliderList = target.closest('#listStack');
                if (sliderList) {
                    this.dragStartHandler(event);
                    return true;
                }
            }
            return false;
        }
        _handleMouseMove(event, stopPropagation) {
            const result = super._handleMouseMove(event, stopPropagation);
            if (result !== undefined) {
                const target = event.target;
                const sliderList = target.closest('#listStack');
                if (sliderList) {
                    this.dragHandler(event);
                    return true;
                }
            }
            return false;
        }
        _handleMouseUp(event, stopPropagation) {
            const result = super._handleMouseUp(event, stopPropagation);
            if (result !== undefined) {
                const target = event.target;
                const sliderList = target.closest('#listStack');
                if (sliderList) {
                    this.dragEndHandler(event);
                    return true;
                }
            }
            return false;
        }
        dragStartHandler(event) {
            if (event instanceof TouchEvent) {
                this.pos1 = {
                    x: event.touches[0].pageX,
                    y: event.touches[0].pageY
                };
            }
            else {
                event.preventDefault();
                this.pos1 = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
            this.pos2 = { x: 0, y: 0 };
            this.datePnlHeight = this.pnlDates.offsetHeight;
            this.isVerticalSwiping = false;
            this.isHorizontalSwiping = false;
        }
        dragHandler(event) {
            event.preventDefault();
            let deltaX = 0;
            if (event instanceof TouchEvent) {
                this.pos2 = {
                    x: this.pos1.x - event.touches[0].pageX,
                    y: event.touches[0].pageY - this.pos1.y
                };
                deltaX = event.touches[0].pageX - this.pos1.x;
            }
            else {
                this.pos2 = {
                    x: this.pos1.x - event.clientX,
                    y: event.pageY - this.pos1.y
                };
                deltaX = event.clientX - this.pos1.x;
            }
            const containerWidth = this.listStack.offsetWidth;
            const containerHeight = this.pnlWrapper.offsetHeight;
            const horizontalThreshold = containerWidth * 0.1;
            const verticalThreshold = this.datePnlHeight * 0.1;
            if (Math.abs(this.pos2.y) >= verticalThreshold && Math.abs(deltaX) < horizontalThreshold) {
                this.isVerticalSwiping = true;
                this.isHorizontalSwiping = false;
                const newHeight = this.datePnlHeight + this.pos2.y;
                if (newHeight > containerHeight * 0.4 && this.pos2.y > verticalThreshold) {
                    this.onSwipeFullMonth();
                }
                else if (newHeight < containerHeight * 0.4 && this.pos2.y < -verticalThreshold) {
                    this.onSwipeWeek();
                }
                else {
                    this.onSwipeMonthEvents();
                }
                return false;
            }
            else if (Math.abs(deltaX) >= horizontalThreshold) {
                this.isVerticalSwiping = false;
                this.isHorizontalSwiping = true;
            }
            else {
                this.isVerticalSwiping = false;
                this.isHorizontalSwiping = false;
            }
        }
        dragEndHandler(event) {
            if (this.isVerticalSwiping || !this.isHorizontalSwiping) {
                event.preventDefault();
                return false;
            }
            const horizontalThreshold = 30;
            let direction = 1;
            if (this.pos2.x < -horizontalThreshold) {
                direction = -1;
            }
            else if (this.pos2.x > horizontalThreshold) {
                direction = 1;
            }
            if (this.viewMode === 'week') {
                this.onSwipeWeek(direction);
            }
            else {
                this.onSwipeFullMonth(direction);
            }
        }
        animateFn(framefn) {
            const duration = 300;
            const easing = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            const animateScroll = (timestamp) => {
                const progress = Math.min(1, (timestamp - startTime) / duration);
                const easedProgress = easing(progress);
                framefn(easedProgress);
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };
            const startTime = performance.now();
            requestAnimationFrame(animateScroll);
        }
        onSwipeFullMonth(direction) {
            this.viewMode = 'month';
            this.style.setProperty('--grow', '0');
            this.style.setProperty('--inner-grow', '1');
            if (direction) {
                this.onMonthChanged(direction);
                this.onScroll(this.listStack, direction, this.listStack.offsetWidth);
            }
            else {
                const { month, year } = this.initialData;
                const monthEl = this.monthsMap.get(`${month}-${year}`);
                if (monthEl)
                    this.updateMonthUI(monthEl);
                this.updateDatesHeight('100%');
                this.pnlSelected.height = 0;
            }
        }
        onSwipeMonthEvents() {
            this.viewMode = 'month';
            this.style.setProperty('--grow', '0');
            this.style.setProperty('--inner-grow', '1');
            this.updateDatesHeight('40%');
            this.pnlSelected.height = 'auto';
            const { date } = this.initialData;
            const { month, year } = this.currentMonth || this.initialData;
            const monthEl = this.monthsMap.get(`${month}-${year}`);
            if (monthEl)
                this.updateMonthUI(monthEl);
            this.updateOldDate();
            const dataDate = `${date}-${month}-${year}`;
            const target = this.listStack.querySelector(`[data-date="${dataDate}"]`);
            this.updateNewDate(target, { ...this.initialData });
            const index = this.datesMap.get(`${month}-${year}`).findIndex(d => d.date === date && d.month === month);
            this.eventSlider.activeSlide = index;
        }
        onSwipeWeek(direction) {
            this.viewMode = 'week';
            this.style.setProperty('--grow', '1');
            this.style.setProperty('--inner-grow', '0');
            this.updateDatesHeight('15%');
            this.pnlSelected.height = 'auto';
            const { month, year } = this.currentMonth || this.initialData;
            let monthEl = this.monthsMap.get(`${month}-${year}`);
            if (!monthEl)
                return;
            this.updateMonthUI(monthEl);
            if (!this.isInitialWeek && !direction) {
                const currentMonth = this.currentDate.getMonth() + 1;
                const currentYear = this.currentDate.getFullYear();
                const currentDate = this.currentDate.getDate();
                if (month === currentMonth && year === currentYear) {
                    const elm = this.listStack.querySelector(`[data-date="${currentDate}-${currentMonth}-${currentYear}"]`);
                    const week = elm?.getAttribute('data-week') || 0;
                    if (week) {
                        const startScrollLeft = monthEl.scrollLeft;
                        const targetScrollLeft = monthEl.scrollLeft + (Number(week) * monthEl.offsetWidth);
                        this.animateFn((progress) => {
                            monthEl.scrollTo({
                                left: startScrollLeft + (targetScrollLeft - startScrollLeft) * progress
                            });
                        });
                    }
                    this.isInitialWeek = true;
                }
            }
            if (!direction)
                return;
            const threshold = this.listStack.offsetWidth * 3;
            const outOfMonth = (monthEl.scrollLeft > threshold && direction === 1) || (monthEl.scrollLeft === 0 && direction === -1);
            if (outOfMonth) {
                this.initialDate = new Date(year, month - 1, 1);
                this.onMonthChanged(direction);
                const { month: newMonth, year: newYear } = this.initialData;
                const newMonthEl = this.monthsMap.get(`${newMonth}-${newYear}`);
                this.onScroll(this.listStack, direction, this.listStack.offsetWidth);
                this.updateMonthUI(newMonthEl);
                const factor = direction === 1 ? 0 : 4;
                newMonthEl.scrollLeft = factor * newMonthEl.offsetWidth;
                this.activeDateWeek(newMonthEl, factor);
            }
            else {
                this.onScroll(monthEl, direction, monthEl.offsetWidth);
                const week = Math.round(monthEl.scrollLeft / this.listStack.offsetWidth) + direction;
                this.activeDateWeek(monthEl, week);
            }
        }
        activeDateWeek(monthEl, week) {
            const dateEl = monthEl.children?.[week]?.children?.[this.initalDay];
            if (dateEl) {
                this.updateOldDate();
                const dateData = dateEl.getAttribute('data-date');
                const [date, month, year] = dateData.split('-');
                if (date) {
                    this.initialDate = new Date(year, month - 1, Number(date));
                    const { month: currentMonth } = this.currentMonth || this.initialData;
                    const index = this.datesMap.get(`${currentMonth}-${year}`).findIndex(d => d.date === Number(date) && d.month === Number(month));
                    this.eventSlider.activeSlide = index;
                    this.selectedDate = dateEl;
                    dateEl.border = { radius: '0.25rem', width: '1px', style: 'solid', color: `${Theme.colors.primary.main}!important` };
                }
            }
        }
        updateMonthUI(month) {
            month.direction = this.isWeekMode ? 'horizontal' : 'vertical';
            this.selectedMonth = month;
        }
        onScroll(parent, direction, cWidth) {
            const containerWidth = this.listStack.offsetWidth + 2;
            const startScrollLeft = parent.scrollLeft;
            const additional = direction === -1 ? 2 : 0;
            const targetScrollLeft = startScrollLeft + (direction * containerWidth) + additional;
            this.animateFn((progress) => {
                parent.scrollTo({
                    left: startScrollLeft + (targetScrollLeft - startScrollLeft) * progress
                });
            });
        }
        onChangeDate() {
            if (this.selectEl) {
                this.selectEl.setData({ date: this.initialDate.toISOString() });
            }
            else {
                this.selectEl = new index_1.ScomCalendarSelect(undefined, {
                    date: this.initialDate.toISOString(),
                    onClose: () => {
                        this.selectEl.closeModal();
                    },
                    onChanged: (date) => {
                        this.selectEl.closeModal();
                        this.initialDate = new Date(date);
                        this.currentMonth = { month: this.initialDate.getMonth() + 1, year: this.initialDate.getFullYear() };
                        this.clear();
                        this.renderUI();
                    }
                });
            }
            this.selectEl.openModal({
                showBackdrop: true,
                popupPlacement: 'bottom',
                width: 'calc(100vw - 2rem)',
                height: 'auto',
                closeIcon: null,
                border: { radius: '1rem' }
            });
        }
        init() {
            super.init();
            this.onFilter = this.getAttribute('onFilter', true) || this.onFilter;
            this.onItemClicked = this.getAttribute('onItemClicked', true) || this.onItemClicked;
            const events = this.getAttribute('events', true);
            this.renderHeader();
            this.setData({ events });
        }
        render() {
            return (this.$render("i-panel", { overflow: 'hidden', background: { color: Theme.background.main }, width: '100%', height: "100%" },
                this.$render("i-vstack", { id: "pnlWrapper", width: '100%', height: "100%", overflow: 'hidden', gap: "1rem" },
                    this.$render("i-vstack", { id: "pnlDates", minHeight: 100, maxHeight: '99%', padding: { top: '0.5rem', left: '0.75rem', right: '0.75rem' }, overflow: 'hidden', class: index_css_1.transitionStyle },
                        this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'center', gap: "0.25rem", cursor: 'pointer', onClick: this.onChangeDate.bind(this) },
                            this.$render("i-label", { id: "lbMonth", font: { size: '1.25rem', weight: 600 } }),
                            this.$render("i-label", { id: "lbYear", font: { size: '1.25rem', color: Theme.text.secondary } })),
                        this.$render("i-grid-layout", { id: "gridHeader", columnsPerRow: DAYS, margin: { top: '0.75rem' } }),
                        this.$render("i-hstack", { id: "listStack", overflow: { x: 'auto', y: 'hidden' }, minHeight: '1.875rem', class: index_css_1.swipeStyle, stack: { grow: '1' } })),
                    this.$render("i-panel", { id: "pnlSelected", stack: { grow: '1', shrink: '1', basis: 'auto' }, minHeight: 0, height: 0, overflow: 'hidden' },
                        this.$render("i-carousel-slider", { id: "eventSlider", swipe: true, width: '100%', height: '100%', indicators: false, autoplay: false, border: { top: { width: '1px', style: 'solid', color: Theme.divider } }, onSlideChange: this.onSlideChanged }))),
                this.$render("i-panel", { position: 'fixed', bottom: "0px", left: "0px", zIndex: 999, width: '100%', padding: { top: '0.5rem', bottom: '0.5rem', left: '0.5rem', right: '0.5rem' }, visible: false },
                    this.$render("i-hstack", { verticalAlignment: 'center', horizontalAlignment: 'space-between', gap: '1rem' },
                        this.$render("i-input", { id: "inputAdd", placeholder: "Add event on", border: { radius: '9999px', width: '1px', style: 'solid', color: Theme.divider }, height: '3.125rem', width: '100%', font: { size: '1rem' }, padding: { top: '0.25rem', bottom: '0.25rem', left: '1.25rem', right: '1.25rem' }, boxShadow: 'none' }),
                        this.$render("i-button", { id: "btnAdd", icon: { name: 'plus', width: '1rem', height: '1rem', fill: Theme.text.primary }, background: { color: 'transparent' }, border: { radius: '9999px' }, height: 50, width: 50, stack: { shrink: '0' } })))));
        }
    };
    ScomCalendar = __decorate([
        components_5.customModule,
        (0, components_5.customElements)('i-scom-calendar')
    ], ScomCalendar);
    exports.default = ScomCalendar;
});

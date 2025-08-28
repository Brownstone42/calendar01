<template>
  <div class="birthday-input-wrap">
    <div class="birthday" :class="{ error: isError }" @keydown.stop @keydown.enter.prevent="emitEnter">
      <div class="icon">
        <div class="normal" :class="{ hide: !!zodiacClass }">
          <!-- smoke -->
          <svg viewBox="0 0 36 36" class="cake-smoke" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M18 11C18 11 18.832 7.48792 20.25 7C20.8172 6.80483 21.1828 7.19517 21.75 7C23.168 6.51208 24 3 24 3"/>
            <path d="M17 8C17 8 16.0731 6.29007 15.2857 6C14.849 5.8391 14.5663 6.24699 14.1429 6C13.1961 5.44772 13 2 13 2"/>
            <path d="M18.0916 5C18.0916 5 17.8855 4.20779 18.0916 3.71429C18.3987 2.97862 20 2 20 2"/>
          </svg>
          <svg class="cake-light" viewBox="0 0 36 36" aria-hidden="true">
            <use xlink:href="#cake-light" />
          </svg>
          <svg class="cake" viewBox="0 0 36 36" aria-hidden="true">
            <use xlink:href="#cake" />
          </svg>
        </div>

        <div class="zodiac">
          <div
            v-for="(z, i) in zodiacs"
            :key="z"
            :class="[z, { show: zodiacClass === z }]"
            :style="{ '--offset': `${-24 * i}px` }"
          ></div>
        </div>
      </div>

      <!-- DD first -->
      <input
        ref="dd"
        type="text"
        class="day"
        placeholder="DD"
        maxlength="2"
        pattern="\d*"
        inputmode="numeric"
        v-model="day"
        @keypress="handleDayKeypress"
        @keydown="handleNav('dd', $event)"
        @input="onInput"
        aria-label="Day"
      />
      <span>/</span>

      <!-- MM second -->
      <input
        ref="mm"
        type="text"
        class="month"
        placeholder="MM"
        maxlength="2"
        pattern="\d*"
        inputmode="numeric"
        v-model="month"
        @keypress="handleMonthKeypress"
        @keydown="handleNav('mm', $event)"
        @input="onInput"
        aria-label="Month"
      />
      <span>/</span>

      <!-- YYYY last -->
      <input
        ref="yyyy"
        type="text"
        class="year"
        placeholder="YYYY"
        maxlength="4"
        pattern="\d*"
        inputmode="numeric"
        v-model="year"
        @keypress="handleYearKeypress"
        @keydown="handleNav('yyyy', $event)"
        @input="onInput"
        aria-label="Year"
      />

      <div class="error-message" :class="{ show: errorMessage }">
        {{ errorMessage }}
      </div>
    </div>

    <!-- SVG symbol defs -->
    <svg xmlns="http://www.w3.org/2000/svg" style="display:none">
      <symbol viewBox="0 0 36 36" id="cake-light" fill="currentColor">
        <path d="M21 10.5C21 12.1569 19.6569 13.5 18 13.5C16.3431 13.5 15 12.1569 15 10.5C15 8.84315 18 3.5 18 3.5C18 3.5 21 8.84315 21 10.5Z"/>
      </symbol>
      <symbol viewBox="0 0 36 36" id="cake" fill="currentColor">
        <path d="M19.5 14V14C19.2793 12.2344 16.7207 12.2344 16.5 14V14C11.25 14.3 6 15.95 6 19.25V23.75C6 27.35 12.15 29 18 29C23.85 29 30 27.35 30 23.75V19.25C30 15.95 24.75 14.3 19.5 14ZM16.5 17V18.5C16.5 19.4 17.1 20 18 20C18.9 20 19.5 19.4 19.5 18.5V17C24.15 17.3 26.7 18.65 27 19.25C26.7 19.85 23.7 21.5 18 21.5C12.3 21.5 9.15 19.85 9 19.25C9.15 18.65 11.7 17.3 16.5 17Z"/>
      </symbol>
    </svg>
  </div>
</template>

<script>
export default {
  name: "BirthdayInput",
  props: {
    modelValue: { type: String, default: null } // v-model: 'YYYY-MM-DD'
  },
  data() {
    return {
      month: "",
      day: "",
      year: "",
      zodiacs: [
        "capricorn","aquarius","pisces","aries","taurus","gemini",
        "cancer","leo","virgo","libra","scorpio","sagittarius"
      ],
      errorMessage: ""
    };
  },
  computed: {
    iso() {
      if (this.year.length === 4 && this.month.length >= 1 && this.day.length >= 1) {
        const mm = this.month.padStart(2, "0");
        const dd = this.day.padStart(2, "0");
        const dt = new Date(`${this.year}-${mm}-${dd}`);
        if (!isNaN(dt)) return `${this.year}-${mm}-${dd}`;
      }
      return null;
    },
    zodiacClass() {
      const d = parseInt(this.day, 10);
      const m = parseInt(this.month, 10);
      if (!d || !m || d < 1 || d > 31 || m < 1 || m > 12) return "";
      const last = ["",19,18,20,20,21,21,22,22,21,22,21,20,19];
      const z = ["", ...this.zodiacs, this.zodiacs[0]];
      return (d > last[m]) ? z[m + 1] : z[m];
    },
    isError() {
      return this.computeErrorMessage() !== "";
    }
  },
  watch: {
    // emit v-model
    iso(val) {
      if (val) {
        this.$emit("update:modelValue", val);
        this.$emit("input", val);
        this.$emit("change", val);
      }
    },
    // optional: hydrate from v-model
    modelValue: {
      immediate: true,
      handler(v) {
        if (!v) { this.month=""; this.day=""; this.year=""; return; }
        const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (m) { this.year=m[1]; this.month=m[2]; this.day=m[3]; }
      }
    }
  },
  methods: {
    emitEnter() {
      // ให้ error ล่าสุดแม่นยำ
      const error = this.computeErrorMessage();
      this.errorMessage = error;
      this.$emit("enter", {
        day: this.day,
        month: this.month,
        year: this.year,
        error
      });
    },
    /* keypress handlers */
    handleMonthKeypress(e) {
      this.onMonthFirstDigit(e); // auto 0x if first digit 2-9
      this.digitsOnly(e);
    },
    handleDayKeypress(e) {
      this.onDayFirstDigit(e);   // auto 0x if first digit 4-9
      this.digitsOnly(e);
    },
    handleYearKeypress(e) {
      this.digitsOnly(e);
    },

    digitsOnly(e) {
      const code = e.keyCode || e.which;
      if (code < 48 || code > 57) e.preventDefault();
    },

    onMonthFirstDigit(e) {
      if (document.activeElement === this.$refs.mm && !this.month.length) {
        const k = e.key;
        if (k >= "2" && k <= "9") {
          this.month = "0" + k;
          this.$nextTick(() => this.onInput());
          this.$nextTick(() => this.focusNext("mm"));
        }
      }
    },
    onDayFirstDigit(e) {
      if (document.activeElement === this.$refs.dd && !this.day.length) {
        const k = e.key;
        if (k >= "4" && k <= "9") {
          this.day = "0" + k;
          this.$nextTick(() => this.onInput());
          this.$nextTick(() => this.focusNext("dd"));
        }
      }
    },

    handleNav(which, e) {
      const input = this.refEl(which);
      const max = parseInt(input.getAttribute("maxlength") || "2", 10);
      // backspace empty or ArrowLeft at start -> prev
      if ((e.keyCode === 8 && !input.value) || (e.keyCode === 37 && input.selectionStart === 0)) {
        e.preventDefault();
        this.focusPrev(which);
        return;
      }
      // filled or ArrowRight at end -> next
      const isNav = [9,37,8].includes(e.keyCode);
      if ((!isNav && input.selectionStart === max) || (e.keyCode === 39 && input.selectionStart === input.value.length)) {
        e.preventDefault();
        this.focusNext(which);
      }
    },

    onInput() {
      // sanitize
      this.month = this.month.replace(/\D/g, "").slice(0, 2);
      this.day   = this.day.replace(/\D/g, "").slice(0, 2);
      this.year  = this.year.replace(/\D/g, "").slice(0, 4);

      // auto-advance (based on DOM order)
      if (this.refFocused(this.$refs.dd) && this.day.length === 2) this.focusNext("dd");
      if (this.refFocused(this.$refs.mm) && this.month.length === 2) this.focusNext("mm");

      // error
      this.errorMessage = this.computeErrorMessage();
    },

    computeErrorMessage() {
      const mv = parseInt(this.month || "0", 10);
      const dv = parseInt(this.day || "0", 10);

      const today = new Date();
      const oldest = new Date();
      oldest.setFullYear(today.getFullYear() - 120);

      const hasDate = (this.month.length >= 1 && this.day.length >= 1 && this.year.length === 4);
      const dt = hasDate ? new Date(`${this.year}-${this.month.padStart(2,"0")}-${this.day.padStart(2,"0")}`) : null;

      const outOfDay = (this.day.length === 2 && (dv < 1 || dv > 31));
      const outOfMonth = (this.month.length === 2 && (mv < 1 || mv > 12));
      const future = (dt && dt > today);
      const tooOld = (dt && dt < oldest);

      if (outOfDay || outOfMonth || future || tooOld) {
        if (future) return "Not born yet?";
        if (tooOld) return "> 120 years is really old!";
        return ""; // keep red border for range issues
      }
      return "";
    },

    /* focus helpers: follow real DOM order (safe after reordering inputs) */
    getInputs() {
      return Array.from(this.$el.querySelectorAll('.birthday input'));
    },
    refEl(which) {
      return which === "mm" ? this.$refs.mm : which === "dd" ? this.$refs.dd : this.$refs.yyyy;
    },
    refFocused(el) {
      return document.activeElement === el;
    },
    focusPrev(which) {
      const inputs = this.getInputs();
      const el = this.refEl(which);
      const i = inputs.indexOf(el);
      if (i > 0) inputs[i - 1].focus();
    },
    focusNext(which) {
      const inputs = this.getInputs();
      const el = this.refEl(which);
      const i = inputs.indexOf(el);
      if (i < inputs.length - 1) inputs[i + 1].focus();
    }
  }
};
</script>

<style scoped>
/* ===== Base (from CodePen, flattened) ===== */
.birthday {
  --background: #fff;
  --border: #e6e7ee;
  --border-width: 1px;
  --border-focus: #0077ff;
  --border-focus-width: 2px;
  --text: #00104b;
  --text-placeholder: #999fb7;
  --default: #0077ff;
  --smoke: var(--text-placeholder);
  --error: #ff5252;
  border-radius: 8px;
  position: relative;
  display: flex;
  align-items: center;
  background: var(--background);
  box-shadow: inset 0 0 0 var(--border-width) var(--border);
  transition: box-shadow .3s;
}

/* ===== FIX: pin SVG (no drift) ===== */
.birthday .icon {
  position: absolute;
  top: 12px;
  left: 12px;
  width: 24px;
  height: 24px;
}
.birthday .icon svg {
  position: absolute;
  inset: 0;
  width: 24px;
  height: 24px;
  display: block;      /* remove inline svg baseline effect */
  opacity: var(--o, 1);
  color: var(--c, var(--default));
  transition: color .3s, opacity .2s;
  transform: none !important; /* keep position stable */
}
.birthday .icon .normal {
  position: absolute;
  inset: 0;
  transition: opacity .2s;
}
.birthday:not(.error) .icon .normal.hide { opacity: 0; }

/* smoke animation (unchanged) */
.birthday .icon .normal .cake-smoke path {
  --size: 11px;
  stroke-dasharray: var(--size);
  stroke-dashoffset: var(--offset, calc(var(--size) * 3));
  transition: stroke-dashoffset var(--d, 0s);
}
.birthday .icon .normal .cake-smoke path:nth-child(2) { --size: 8px; }
.birthday .icon .normal .cake-smoke path:nth-child(3) { --size: 4px; }

/* zodiac sprite */
.birthday .icon .zodiac div {
  position: absolute;
  left: 0; top: 0;
  width: 24px; height: 24px;
  background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/165585/zodiac-signs-sprite%402x.png');
  background-size: auto 24px;
  background-position: var(--offset) 0;
  opacity: 0;
  transform-origin: top left;
  transition: transform .2s, opacity .2s;
  transform: scale(.6);
}
.birthday .icon .zodiac .show {
  opacity: 1;
  transform: scale(1);
}

/* ===== Inputs: bind sizes by TYPE (safe after reordering) ===== */
.birthday input {
  -webkit-appearance: none;
  background: none;
  border: none;
  outline: none;
  text-align: center;
  font-family: inherit;
  font-size: 16px;
  margin: 0;
  line-height: 24px;
  padding: 12px var(--r, 0) 12px var(--l, 0);
  width: var(--w, 22px);
  color: var(--text);
}

/* first field (whoever it is) needs left padding for icon */
.birthday input:first-of-type { --l: 44px; }

/* widths by class */
.birthday input.month { --w: 72px; }         /* MM */
.birthday input.day   { --w: 64px; }         /* DD (optional wider) */
.birthday input.year  { --w: 64px; --r: 24px; } /* YYYY + right padding */

.birthday input::placeholder {
  font-size: 15px;
  color: var(--text-placeholder);
}

/* slashes */
.birthday span {
  display: block;
  opacity: .4;
  margin: -1px 3px 0 3px;
  color: var(--text-placeholder);
}

/* error message */
.birthday .error-message {
  position: absolute;
  top: 100%;
  left: 50%;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 500;
  opacity: 0;
  color: var(--error);
  transition: opacity .2s, transform .2s;
  transform: translate(-50%, 4px) scale(.8);
}
.birthday .error-message.show {
  opacity: 1;
  transform: translate(-50%, 0) scale(1);
}

/* focus ring */
.birthday:focus-within {
  --border: var(--border-focus);
  --border-width: var(--border-focus-width);
}

/* error state */
.birthday.error {
  --border: var(--error);
  --border-width: var(--border-focus-width);
}
.birthday.error .icon .normal { --c: var(--error); }
.birthday.error .icon .normal .cake-smoke path {
  --d: .6s;
  --offset: var(--size);
}
.birthday.error .icon .normal .cake-light { opacity: 0; }

/* base */
html { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
*, *::before, *::after { box-sizing: inherit; }

/* ปรับค่าแบบปรับได้ */
.birthday {
  --gap: 2px;           /* ระยะห่างซ้าย/ขวาของ "/" */
  --w-day: 76px;        /* กว้างช่อง DD */
  --w-month: 46px;      /* กว้างช่อง MM (ลดจากเดิม 72px) */
  --w-year: 70px;       /* กว้างช่อง YYYY */
}

/* ใช้ตัวแปรข้างบนแทนค่าคงที่ */
.birthday span {
  margin: -1px var(--gap) 0 var(--gap);
}

.birthday input.day   { --w: var(--w-day); }
.birthday input.month { --w: var(--w-month); }
.birthday input.year  { --w: var(--w-year); --r: 24px; }

/* ช่องแรก (ตอนนี้คือ DD) ยังต้องเว้นซ้ายให้ไอคอน */
.birthday input:first-of-type { --l: 44px; }
</style>

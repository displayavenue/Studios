{{-- Shared image crop / zoom / rotate modal for all admin image fields --}}
<div class="hp-imgadj" id="hp-imgadj" hidden data-hp-imgadj>
    <div class="hp-imgadj__backdrop" data-hp-imgadj-close></div>
    <div class="hp-imgadj__dialog" role="dialog" aria-modal="true" aria-labelledby="hp-imgadj-title">
        <header class="hp-imgadj__header">
            <div>
                <h3 id="hp-imgadj-title">Adjust image</h3>
                <p class="admin-muted" style="margin:0.2rem 0 0;">Crop, zoom, pan, and rotate before saving.</p>
            </div>
            <button type="button" class="btn btn-secondary" data-hp-imgadj-close>Close</button>
        </header>

        <div class="hp-imgadj__stage">
            <img data-hp-imgadj-image alt="Image being adjusted">
        </div>

        <div class="hp-imgadj__controls">
            <label class="hp-imgadj__control">
                <span>Aspect</span>
                <select data-hp-imgadj-aspect>
                    <option value="NaN">Free</option>
                    <option value="1">Square 1∶1</option>
                    <option value="{{ 1376/1146 }}">Disease 1376∶1146</option>
                    <option value="0.8">Portrait 4∶5</option>
                    <option value="{{ 16/9 }}">Landscape 16∶9</option>
                    <option value="{{ 21/9 }}">Wide 21∶9</option>
                </select>
            </label>
            <label class="hp-imgadj__control">
                <span>Zoom</span>
                <input type="range" data-hp-imgadj-zoom min="0.2" max="3" step="0.01" value="1">
            </label>
            <div class="hp-imgadj__actions">
                <button type="button" class="btn btn-secondary" data-hp-imgadj-rotate="-90">Rotate left</button>
                <button type="button" class="btn btn-secondary" data-hp-imgadj-rotate="90">Rotate right</button>
                <button type="button" class="btn btn-secondary" data-hp-imgadj-reset>Reset</button>
            </div>
        </div>

        <footer class="hp-imgadj__footer">
            <button type="button" class="btn btn-secondary" data-hp-imgadj-close>Cancel</button>
            <button type="button" class="btn btn-primary" data-hp-imgadj-apply>Apply &amp; save</button>
        </footer>
    </div>
</div>

/**
 * Created by dingdafei on 14-11-27.
 */
(function($){
    $.fn.selectBeauty = function(options) {
        var $this = $(this);
        var parent = $this.parent();
        var selectWrap = null;
        var liList = $this.children('option');
        var optionNum = liList.length;
        var defaults = {
            "beforeInit":beforeInit,
            "wrapClass":"selectBeauty",
            "readOnly":false,
            "onInit":initSelect,
            "onChange":changeValue
        }
        var defaults = $.extend(defaults, options);

        defaults.onInit();

        function beforeInit(){
            //console.log('this is happened before init');
        }

        function initSelect(optionList){
            if(optionList == undefined) {
                optionList = liList;
            }
            defaults.beforeInit();
            selectWrap = $this.wrap('<div class="' + defaults.wrapClass + '"></div>');
            var ul = $('<ul class="ul_' + defaults.wrapClass + '"></ul>');
            var selectedIndex = $this.find('option[selected="selected"]').index();
            $.each(optionList, function(i, n) {
                var value = $(n).val();
                var text = $(n).text();
                if(i == selectedIndex) {
                    var li = $('<li class="current" data-value="' + value + '">' + text + '</li>');
                }
                else {
                    var li = $('<li data-value="' + value + '">' + text + '</li>');
                }
                ul.append(li);
            })
            ul.hide();
            $this.after(ul);

            var input = $('<input type="text" class="input_' + defaults.wrapClass + '">');
            var selected = $this.find('option:selected');
            input.attr('value', selected.text());
            input.attr('data-value', selected.val());
            $this.after(input);
            input.prop('readOnly', defaults.readOnly);

            $this.hide();

        }
        parent.delegate($this.siblings('input'), 'click', function(event) {
            event.stopPropagation();
            showList();
        })

        /*parent.click(function(event) {
            event.stopPropagation();
            if(event.target == $this.siblings('.input_' + defaults.wrapClass).get(0)){
                showList();
            }
        })*/

        parent.delegate('.input_' + defaults.wrapClass, 'keyup', function(event) {
            event.stopPropagation();
            var keyCode = event.keyCode.toString();
            switch(keyCode) {
                case '40':
                    selectPre();
                    break;
                case '38':
                    selectNext();
                    break;
                case '13':
                    choseValue(event);
                    break;
                default:
                    getValue();break;
            }
        })

        parent.delegate($this, 'change', function() {
            var dataValue = $this.siblings('.input_' + defaults.wrapClass).attr('data-value');
            defaults.onChange(dataValue);
        })

        parent.delegate('li', 'click', function(event) {
            event.stopPropagation();
            var index = $(this).index();
            $this.children('option').eq(index).prop('selected',true).siblings().prop('selected', false);
            $this.siblings('input').val($(this).text());
            $this.siblings('input').attr('data-value', $(this).attr('data-value'));
            $(this).addClass('current').siblings().removeClass('current');
            defaults.onChange($(this).attr('data-value'));
            hideList();
        })
        parent.delegate('li', 'mouseover', function() {
            $(this).addClass('current').siblings().removeClass('current');
        })

        function changeValue() {
        }

        function getValue() {
            var inputValue = $this.siblings('.input_' + defaults.wrapClass).val();
            var optionList = [];
            $.each(liList, function(i, n) {
                if($(n).text().indexOf(inputValue) != -1) {
                    optionList.push(n);
                }
            })
            setUl(optionList);
        }

        function setUl(optionList, index) {
            if(optionList == undefined) {
                optionList = liList;
            }
            var ul = $this.siblings('.ul_' + defaults.wrapClass);
            ul.empty();

            $.each(optionList, function(i, n) {
                var value = $(n).val();
                var text = $(n).text();
                if(index != undefined && i == index) {
                    var li = $('<li class="current" data-value="' + value + '">' + text + '</li>');
                }
                else {
                    var li = $('<li data-value="' + value + '">' + text + '</li>');
                }
                ul.append(li);
            })

        }

        function selectPre(){
            var height = $this.siblings('.ul_' + defaults.wrapClass).height();
            var currentIndex = $this.siblings('.ul_' + defaults.wrapClass).children('.current').index();
            currentIndex++;
            if(currentIndex == optionNum){
                return;
            }
            var offsetTop = $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(currentIndex).position().top;
            if(offsetTop + 26 >= height) {
                offsetTop += 26;
                $this.siblings('.ul_' + defaults.wrapClass).scrollTop(offsetTop);
            }
            $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(currentIndex).addClass('current').siblings().removeClass('current')
            var dataValue = $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(currentIndex).attr('data-value');
            var text = $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(currentIndex).text();
            $this.siblings('input').attr('value', text);
            $this.siblings('input').attr('data-value', dataValue);
        }
        function selectNext(){
            var height = $this.siblings('.ul_' + defaults.wrapClass).height();
            var currentIndex = $this.siblings('.ul_' + defaults.wrapClass).children('.current').index();
            if(currentIndex == 0) {
                return;
            }
            currentIndex--;
            var offsetTop = $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(currentIndex).position().top;
            if(offsetTop + 26 <= height) {
                offsetTop -= 26;
                $this.siblings('.ul_' + defaults.wrapClass).scrollTop(offsetTop);
            }
            $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(currentIndex).addClass('current').siblings().removeClass('current');
            var dataValue = $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(currentIndex).attr('data-value');
            var text = $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(currentIndex).text();
            $this.siblings('input').attr('value', text);
            $this.siblings('input').attr('data-value', dataValue);
        }

        function choseValue(event) {
            event.preventDefault();
            var currentIndex = $this.siblings('.ul_' + defaults.wrapClass).children('.current').index();
            hideList();
            $this.children('option').eq(currentIndex).prop('selected',true).siblings().prop('selected', false);
            var dataValue = $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(currentIndex).attr('data-value');
            var text = $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(currentIndex).text();
            $this.siblings('input').attr('value', text);
            $this.siblings('input').attr('data-value', dataValue);
            defaults.onChange(dataValue);
        }




        function showList() {
            var selectedIndex = $this.find('option:selected').index();
            $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(selectedIndex).addClass('current').siblings().removeClass('current');

            $this.siblings('.ul_' + defaults.wrapClass).show();


            var height = $this.siblings('.ul_' + defaults.wrapClass).height();
            var showCount = Math.floor(height / 26);
            if(selectedIndex >= showCount) {
                var scrollTop = (selectedIndex + 1 - showCount) * 26;
                $this.siblings('.ul_' + defaults.wrapClass).scrollTop(scrollTop);
            }
            else {
                $this.siblings('.ul_' + defaults.wrapClass).scrollTop(0);
            }
        }

        function hideList() {
            var selectedIndex = $this.find('option:selected').index();
            $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(selectedIndex).addClass('current').siblings().removeClass('current');
            $this.siblings('.ul_' + defaults.wrapClass).hide();
            var dataValue = $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(selectedIndex).attr('data-value');
            var text = $this.siblings('.ul_' + defaults.wrapClass).children('li').eq(selectedIndex).text();
            $this.siblings('input').attr('value', text);
            $this.siblings('input').attr('data-value', dataValue);
            setUl(liList, selectedIndex);
        }

        $(document).click(function(){
            hideList();
        })
    }
})(jQuery)
import Quartz

def get_element_under_mouse():
    # Get mouse position (origin is bottom left for Quartz)
    mouse_loc = Quartz.NSEvent.mouseLocation()
    point = (mouse_loc.x, Quartz.CGDisplayPixelsHigh(Quartz.CGMainDisplayID()) - mouse_loc.y)
    # Get the accessibility element under mouse
    sys_ax = Quartz.AXUIElementCreateSystemWide()
    result, elem = Quartz.AXUIElementCopyElementAtPosition(sys_ax, point[0], point[1], None)
    if result == 0 and elem:
        return elem
    return None

def get_text_from_element(element):
    # Try to get the "AXValue" (for text fields) or "AXTitle"
    for attr in ["AXValue", "AXTitle", "AXDescription"]:
        try:
            result, value = Quartz.AXUIElementCopyAttributeValue(element, attr, None)
            if result == 0 and value:
                print(f"{attr}: {value}")
        except Exception:
            continue

def main():
    elem = get_element_under_mouse()
    if elem:
        get_text_from_element(elem)
    else:
        print("No accessible element under mouse")

if __name__ == "__main__":
    main()
